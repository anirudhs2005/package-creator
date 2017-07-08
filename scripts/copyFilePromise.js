const fse = require('fs-extra');
const {constants} = require('./constantsStore');
const {CustomError} = require('./errorGenerator');
async function copyFile(fromPath, toPath) {
    try {
        const exists = await fse.pathExists(fromPath);
        if(!exists){
        	const {INVALID_FILE_PATH,INVALID_FILE_PATH_MESSAGE} = constants;
        	throw new CustomError(INVALID_FILE_PATH,INVALID_FILE_PATH_MESSAGE,fromPath);
        }
        const fileCopyResult = await new Promise((resolve, reject) => {
            try {
                fse.copy(fromPath, toPath, (err) => {
                    if (err) {
                        throw err;
                    } else {
                        resolve(`Copied file from ${fromPath} to ${toPath}`);
                    }
                })
            } catch (err) {
                reject(err);
            }

        });
       return fileCopyResult;
    } catch (err) {
        throw err;
    }
}


function copyFilePromiseMaker({
    fromPath,
    toPath
} = {}) {
    return copyFile(fromPath, toPath);
}

module.exports.copyFilePromiseMaker = copyFilePromiseMaker;