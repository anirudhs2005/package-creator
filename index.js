const xml2objectPromiseMaker = require('./scripts/xml2objectPromise');
const promisify = require('promisify-node');
const fsp = promisify('fs');
const path = require('path')


const sourcePath = './inputs/';
const acceptedFileExtensions = new Set(['.xml', '.csv']);
const tags2Parse = ['types', 'version'];
async function runLogic(src, acceptedFileExtensions, tags2Parse) {
    try {
        //Check for File Existence/ Read permissions
        await fsp.access(src, fsp.constants.R_OK);
        //Get the stats of your source
        const stats = await fsp.stat(src);
        const isFile = stats.isFile();
        const isDirectory = stats.isDirectory();
        let filePaths = [];
        //If it's a directory then get all the filePaths after normalizing
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
                const xml2ObjPromise = xml2objectPromiseMaker(tags2Parse, fpath);
                allPromises.push(xml2ObjPromise);

            }
            if (extname === '.csv') {
                //TO DO. Write a CSV Parser with promise
            }
        });
        //Each ParseResult
        const parseResults = await Promise.all(allPromises);
        parseResults.forEach(parseResult => {
            console.log(parseResult.filePath);
            console.log(parseResult.data);
            console.log(parseResult.version);
        });

    } catch (err) {
        console.log('Haha', err);
    }
}

runLogic(sourcePath, acceptedFileExtensions, tags2Parse);