const promisify = require('promisify-node');
const path = require('path');
const xml2objectPromiseMaker = require('./scripts/xml2objectPromise');
const csv2ObjectPromiseMaker = require('./scripts/csv2ObjectPromise');
const preProcessorPromiseMaker = require('./scripts/preprocessorPromise');
const {
    constants
} = require('./scripts/constantsStore');
const {
    describeMetadataPromise
} = require('./scripts/describeMetadataPromise');
const {
    validateMedataPromiseMaker
} = require('./scripts/validateFileContentsPromise');

const {
    consolidateParseResultsPromiseMaker
} = require('./scripts/consolidateParseResultsPromise');

const {
    createFoldersPromiseMaker
} = require('./scripts/createFoldersAndFilesPromise');

const dotenv = require('dotenv').config({
    path: './config/vars.env'
});

const {generatePackageXMLPromiseMaker} = require('./scripts/generatePackageXMLPromiseMaker');
const fsp = promisify('fs');
const fse = require('fs-extra');

const sourcePath = path.resolve(path.join(__dirname,process.env.SF_PACKAGE_XML_BUILD_NOTES_SOURCE));
const acceptedFileExtensions = new Set([constants.XML, constants.CSV]);


async function createDeployablePackage(src, acceptedFileExtensions) {
    try {
        const inputSourcePath = path.resolve(`${process.env.SF_PACKAGE_SOURCE}`);
        await fse.ensureDir(inputSourcePath);
        const outputPath = path.resolve(`${process.env.SF_PROGRAM_OUTPUT_FOLDER}${process.env.SF_TO_DEPLOY_FOLDER_NAME}`);
        await fse.emptyDir(outputPath);
        await fse.ensureDir(outputPath);
        //Check for File Existence/ Read permissions
        await fsp.access(src, fsp.constants.R_OK);
        //Get the stats of your source
        const stats = await fsp.stat(src);
        const isFile = stats.isFile();
        const isDirectory = stats.isDirectory();
        let filePaths = [];
        //If it's a directory, then get all the filePaths after normalizing
        if (isDirectory) {
            const fileNames = await fsp.readdir(src);
            filePaths = fileNames.map(fname => {
                const fpath = `${src}/${fname}`;
                const normalizedPath = path.normalize(fpath);
                return normalizedPath;

            });

        } else if (isFile) {
            //If Input is a file, then push it into the array
            filePaths.push(src);
        } else {
            throw new Error({
                code: 'Neither a file nor a directory.'
            });
        }
        //Filter the files based on the accepted extensions.
        //acceptedFileExtensions is a Set
        filePaths = filePaths.filter(fpath => {
            const extension = path.extname(fpath);
            return acceptedFileExtensions.has(extension);
        });
        //Initiate file parsings based on file extension.
        let allPromises = [];
        filePaths.forEach((fpath) => {
            const extname = path.extname(fpath);
            if (extname === constants.XML) {
                //Instantiate XMl Parser when file is of type XML
                const xml2ObjPromise = xml2objectPromiseMaker({
                    filePath: fpath
                });
                allPromises.push(xml2ObjPromise);

            }
            if (extname === constants.CSV) {
                //Instantiate CSV Parser when file is of type CSV
                const csv2ObjectPromise = csv2ObjectPromiseMaker({
                    filePath: fpath
                });
                allPromises.push(csv2ObjectPromise);
            }
        });


        //When ALL the promises are resolved, we have the list of results in the callbacks

        const parseResults = await Promise.all(allPromises);
        let preprocessorPromises = [];
        parseResults.forEach(parseResult => {
            preprocessorPromises.push(new preProcessorPromiseMaker(parseResult));
        });
        //Wait for the filtered results.
        const processedParseResults = await Promise.all(preprocessorPromises);
        
        //Describe Metadata of the target org you are trying to deploy
        const describeMetadataResult = await describeMetadataPromise();
        const folderStructureCreationResult = await fsp.writeFile(`./config/${constants.FOLDER_STRUCTURE_FILE}`, JSON.stringify(describeMetadataResult, null, '\t'));

        const {
            metadataObjects
        } = describeMetadataResult;

        //Validate all the types against metadataObjects
        const {
            areTypesValid
        } = await validateMedataPromiseMaker(metadataObjects, processedParseResults);
        //Consolidate all results from all files
        const {
            consolidatedData
        } = await consolidateParseResultsPromiseMaker(processedParseResults);
        //
        const packageCreationResult = await createFoldersPromiseMaker({
            metadata: metadataObjects,
            consolidatedParseResults: consolidatedData
        });
        
        //Generated package.xml
        const packagexml = await generatePackageXMLPromiseMaker(consolidatedData);
        console.log(packagexml);
        //Created package.xml
        await fsp.writeFile(path.resolve(`${process.env.SF_PROGRAM_OUTPUT_FOLDER}${process.env.SF_TO_DEPLOY_FOLDER_NAME}/package.xml`),packagexml);
        return {packageCreationResult,packagexml};


    } catch (err) {
        throw err;
    }
}
//Consume code
createDeployablePackage(sourcePath, acceptedFileExtensions)
    .then((packageCreationResult) => {
        console.log(packageCreationResult);
    })
    .catch((err) => {
        console.log(err);
        fse.emptyDir(path.resolve(`${process.env.SF_PROGRAM_OUTPUT_FOLDER}${process.env.SF_TO_DEPLOY_FOLDER_NAME}`), function(err){
             console.log(err);
        })

    });
