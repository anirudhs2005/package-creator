const xml2objectPromiseMaker = require('./scripts/xml2objectPromise');
const csv2ObjectPromiseMaker = require('./scripts/csv2ObjectPromise');
const promisify = require('promisify-node');
const fsp = promisify('fs');
const path = require('path')


const sourcePath = './inputs/buildnotes.csv';
const acceptedFileExtensions = new Set(['.xml', '.csv']);
async function runLogic(src, acceptedFileExtensions, tags2Parse) {
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
        let allPromises = [];
        filePaths.forEach((fpath) => {
            const extname = path.extname(fpath);
            if (extname === '.xml') {
            	//Instantiate XMl Parser when file is of type XML
                const xml2ObjPromise = xml2objectPromiseMaker({filePath:fpath});
                allPromises.push(xml2ObjPromise);

            }
            if (extname === '.csv') {
                //Instantiate CSV Parser when file is of type CSV
                const csv2ObjectPromise = csv2ObjectPromiseMaker({filePath:fpath});
                allPromises.push(csv2ObjectPromise);
            }
        });
        //Each ParseResult
        const parseResults = await Promise.all(allPromises);
        parseResults.forEach(parseResult => {
            console.log('FilePath',parseResult.filePath);
            console.log('Data',parseResult.data);
            console.log('version', parseResult.version);
        });

    } catch (err) {
        console.log('We have an ERROR', err);
    }
}

runLogic(sourcePath, acceptedFileExtensions);