const promisify = require('promisify-node');
const path = require('path');
const xml2objectPromiseMaker = require('./scripts/xml2objectPromise');
const csv2ObjectPromiseMaker = require('./scripts/csv2ObjectPromise');
const preProcessorPromiseMaker = require('./scripts/preprocessorPromise');
const {constants} = require('./scripts/constantsStore');
const {describeMetadataPromise} = require('./scripts/describeMetadataPromise');
const {validateMedataPromiseMaker} = require('./scripts/validateFileContentsPromise');
const {createFoldersPromiseMaker} = require('./scripts/createFoldersPromise');
const {consolidateParseResultsPromiseMaker} = require('./scripts/consolidateParseResultsPromise');
const fsp = promisify('fs');


const sourcePath = './inputs/.';
const acceptedFileExtensions = new Set([constants.XML, constants.CSV]);
async function runLogic(src, acceptedFileExtensions) {
    try {
       
        
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
                const xml2ObjPromise = xml2objectPromiseMaker({filePath:fpath});
                allPromises.push(xml2ObjPromise);

            }
            if (extname === constants.CSV) {
                //Instantiate CSV Parser when file is of type CSV
                const csv2ObjectPromise = csv2ObjectPromiseMaker({filePath:fpath});
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
        processedParseResults.forEach(parseResult =>{
            console.log('File Path', parseResult.filePath);
            console.log('Cleansed Data',parseResult.data);
            console.log('version', parseResult.version);
        });
        //Describe Metadata of the target org you are trying to deploy
        const describeMetadataResult= await describeMetadataPromise();
        const folderStructureCreationResult = await fsp.writeFile(`./config/${constants.FOLDER_STRUCTURE_FILE}`,JSON.stringify(describeMetadataResult,null,'\t'));
        
        const {metadataObjects} = describeMetadataResult;

        //Validate all the types against metadataObjects
        const {areTypesValid} = await validateMedataPromiseMaker(metadataObjects,processedParseResults);
        console.log(areTypesValid);
        const {consolidatedData}= await consolidateParseResultsPromiseMaker(processedParseResults);
        console.log(consolidatedData);
        const foldersCreationResult = await createFoldersPromiseMaker({metadata : metadataObjects,consolidatedParseResults:consolidatedData});
        console.log(foldersCreationResult);


    } catch (err) {
        console.log(err.code,err.message,err.type,err.index,err.filePath);
    }
}

runLogic(sourcePath, acceptedFileExtensions);