const promisify = require('promisify-node');
const fsp = promisify('fs');
const {
    constants
} = require('./constantsStore');
const {
    CustomError
} = require('./errorGenerator');

const dotenv = require('dotenv').config({
    path: './config/vars.env'
});

const {
    copyFilePromiseMaker
} = require('./copyFilePromise');



const path = require('path');

async function createFolders(config) {
    try {
        //TO DO: Validate source,
        const {
            source,
            target,
            metadata,
            consolidatedParseResults
        } = config;
        const {
            META_XML
        } = constants;
        const programOutputFolder = process.env.SF_PROGRAM_OUTPUT_FOLDER;
        const deploymentPackageFolder = process.env.SF_TO_DEPLOY_FOLDER_NAME;

        //TO DO : Validate deploymentPackageFolder,programOutputFolder
        /**
         * 1. Find the folders to create
         * 2. 
         */
        const metadataByXmlName = new Map();
        metadata.forEach(mdata => {
            metadataByXmlName.set(mdata.xmlName, mdata);
        });
        let folders2Create = new Set();
        const consolidatedParseResultsArray = [];
        for (const [type, members] of consolidatedParseResults) {
            const {
                directoryName,
                inFolder,
                metaFile,
                suffix
            } = metadataByXmlName.get(type);
            folders2Create.add(directoryName);
            consolidatedParseResultsArray.push([type, members]);
        }

        folders2Create = [...folders2Create];
        const targetPath = `${programOutputFolder}/${deploymentPackageFolder}`;
        const resolvedSourcePath = path.resolve(source);
        const resolvedTargetPath = path.resolve(targetPath);
        const folderCreationResults = await Promise.all(folders2Create.map(async folder => {
            const folderPath = path.resolve(`${resolvedTargetPath}/${folder}`);
            await fsp.mkdir(folderPath);

            return {
                message: `Created ${folderPath}`,
                created: true
            };
        }));
        const packageFileResults = await Promise.all(consolidatedParseResultsArray.map(async([type, members]) => {
            const resultsByType = new Map();

            try {
                const {
                    directoryName,
                    inFolder,
                    metaFile,
                    suffix
                } = metadataByXmlName.get(type);
                if (inFolder) {
                    if (!members.some(member => member.indexOf('/') !== -1)) {
                        const {
                            FOLDER_PATH_INVALID,
                            FOLDER_PATH_INVALID_MESSAGE
                        } = constants;
                        throw new CustomError(FOLDER_PATH_INVALID, FOLDER_PATH_INVALID_MESSAGE);
                    }
                    let innerFolders = members.map(member => {
                        const [folderName] = member.split('/');
                        return folderName;
                    });
                    innerFolders = [...new Set(innerFolders)];
                    //Create the folders required for metatypes that require folder-based deployment
                    let innerFolderCreationResults = await Promise.all(innerFolders.map(async folder => {
                        const folderPath = path.resolve(`${resolvedTargetPath}/${directoryName}/${folder}`);
                        await fsp.mkdir(folderPath);
                        let folderMetaCopyResult = '';
                        if (folder !== 'unfiled$public') {
                            const folderXMLPath = `${directoryName}/${folder}${META_XML}`;
                            const fromPath = path.resolve(`${resolvedSourcePath}/${folderXMLPath}`);
                            const toPath = path.resolve(`${resolvedTargetPath}/${folderXMLPath}`);
                            folderMetaCopyResult = await copyFilePromiseMaker({
                                fromPath,
                                toPath
                            });
                        }
                        return {
                            folderResult: {
                                created: true,
                                message: `Created folder @ ${folderPath}`
                            },
                            folderMetaResult: {
                                created: (folderMetaCopyResult === '' ? false : true),
                                message: `Created folder meta @ ${folderMetaCopyResult}`
                            }
                        }

                    }));



                    //We expect folder based deployment metatypes to have a their folder path
                    const files = members.filter(member => member.indexOf('/') !== -1);
                    //Result of copying files and their meta
                    const filesInsideFolderCopyResult = await Promise.all(files.map(async file => {
                        console.log('File', file);
                        const [folder, fileName] = file.split('/');
                        const fileXMLPath = `${directoryName}/${folder}/${fileName}.${suffix}`;
                        const sourceFilePath = `${resolvedSourcePath}/${fileXMLPath}`;
                        const targetFilePath = `${resolvedTargetPath}/${fileXMLPath}`;
                        const filecopypromises = [];
                        const fromPath = path.resolve(sourceFilePath);
                        const toPath = path.resolve(targetFilePath);
                        const fileCopyPromise = copyFilePromiseMaker({
                            fromPath,
                            toPath
                        });
                        filecopypromises.push(fileCopyPromise);
                        if (metaFile) {
                            const fromPath = path.resolve(`${sourceFilePath}${META_XML}`);
                            const toPath = path.resolve(`${targetFilePath}${META_XML}`);
                            const fileMetaCopyPromise = copyFilePromiseMaker({
                                fromPath,
                                toPath
                            });
                            filecopypromises.push(fileMetaCopyPromise);
                        }

                        const [fileCopyResult, fileMetaCopyResult] = await Promise.all(filecopypromises);
                        return {
                            fileCreationResult: {
                                created: true,
                                message: fileCopyResult
                            },
                            fileMetaCreationResult: {
                                created: (!fileMetaCopyResult ? false : true),
                                message: fileMetaCopyResult || ''
                            }
                        };
                    }));

                    innerFolderCreationResults = [...innerFolderCreationResults, ...filesInsideFolderCopyResult];

                    resultsByType.set(type, innerFolderCreationResults);





                } else {

                    const sourceDirectory = `${resolvedSourcePath}/${directoryName}`;
                    const targetDirectory = `${resolvedTargetPath}/${directoryName}`;
                    const fileCopyResults = await Promise.all(members.map(async member => {
                        try {
                            const sourceFilePath = path.resolve(`${sourceDirectory}/${member}.${suffix}`);
                            const targetFilePath = path.resolve(`${targetDirectory}/${member}.${suffix}`);
                            const fromPath = sourceFilePath;
                            const toPath = targetFilePath;
                            const fromPathMeta = `${sourceFilePath}${META_XML}`;
                            const toPathMeta = `${targetFilePath}${META_XML}`;
                            const fileCopyresult = await copyFilePromiseMaker({
                                fromPath,
                                toPath
                            });
                            let metafilecopyresult = '';
                            if (metaFile) {

                                metafilecopyresult = await copyFilePromiseMaker({
                                    fromPath: fromPathMeta,
                                    toPath: toPathMeta
                                });
                            }
                            return {
                                fileCreationResult: {
                                    created: true,
                                    message: fileCopyresult
                                },
                                fileMetaCreationResult: {
                                    created: (!metafilecopyresult ? false : true),
                                    message: metafilecopyresult
                                }
                            };
                        } catch (err) {
                            throw err;
                        }

                    }));

                    resultsByType.set(type, fileCopyResults);
                    
                }

                return resultsByType;
                
            } catch (err) {
                err.metadataType = type;
                throw err;
            }

        }))

        return {topLevelFolderCreationResult : folderCreationResults, resultsByType:[...packageFileResults]};
    } catch (err) {
        throw err;
    }




}




function createFoldersPromiseMaker({
    source = process.env.SF_PACKAGE_SOURCE,
    target = process.env.SF_PROGRAM_OUTPUT_FOLDER,
    metadata = [],
    consolidatedParseResults = []
} = {
    source: process.env.SF_PACKAGE_SOURCE,
    target: process.env.SF_PROGRAM_OUTPUT_FOLDER,
    metadata: [],
    consolidatedParseResults: []
}) {
    return createFolders({
        source,
        target,
        metadata,
        consolidatedParseResults
    });
}

module.exports.createFoldersPromiseMaker = createFoldersPromiseMaker;