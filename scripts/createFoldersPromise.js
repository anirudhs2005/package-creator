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
        let allResults = {};
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
        const targetPath = `${programOutputFolder}/${deploymentPackageFolder}/src`;
        const resolvedSourcePath = path.resolve(source);
        const resolvedTargetPath = path.resolve(targetPath);
        const folderCreationResults = await Promise.all(folders2Create.map(async folder => {
            const folderPath = path.resolve(`${resolvedTargetPath}/${folder}`);
            await fsp.mkdir(folderPath);

            return `Created ${folderPath}`;
        }));
        allResults.folderCreationResults = folderCreationResults;
        const packageFileResults = await Promise.all(consolidatedParseResultsArray.map(async ([type, members]) => {
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
                                const innerFolderCreationResults = await Promise.all(innerFolders.map(async folder => {
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
                                                return `Created folder @ ${folderPath} for ${type}  ${folderMetaCopyResult!==''?`and ${folderMetaCopyResult}`:''}`;
                    }));
                   allResults.innerFolderCreationResults = innerFolderCreationResults;
                   const files = members.map(member =>member.indexOf('/')!==-1);
                   const filesInsideFolderCopyResult = await Promise.all(files.map(async file=>{
                        const [folder,fileName]= file.split('/');
                        const fileXMLPath = `${directoryName}/${folder}/${fileName}.${suffix}`;
                        const sourceFilePath = `${resolvedSourcePath}/${fileXMLPath}`;
                        const targetFilePath = `${resolvedTargetPath}/${fileXMLPath}`;
                        const filecopypromises = [];
                        const fromPath =path.resolve(sourceFilePath);
                        const toPath = path.resolve(targetFilePath);
                        const fileCopyPromise = copyFilePromiseMaker({fromPath,toPath});
                        filecopypromises.push(fileCopyPromise);
                        if(metaFile){
                            const fromPath = path.resolve(`${sourceFilePath}${META_XML}`);
                            const toPath = path.resolve(`${targetFilePath}${META_XML}`);
                            const fileMetaCopyPromise = copyFilePromiseMaker({fromPath,toPath});
                            filecopypromises.push(fileMetaCopyPromise);
                        }
                        
                        const fileCopyResults = await Promise.all(filecopypromises);
                        return `Copied ${fileCopyResults[0]} and ${fileCopyResults[1]}`;
                   }));

                  allResults.filesInsideFolderCopyResult = filesInsideFolderCopyResult;



                }else{

                    const sourceDirectory = `${resolvedSourcePath}/${directoryName}`;
                    const targetDirectory= `${resolvedTargetPath}/${directoryName}`;
                    const fileCopyResults = await Promise.all(members.map(async member =>{
                            try{
                                const sourceFilePath = path.resolve(`${sourceDirectory}/${member}.${suffix}`);
                                const targetFilePath = path.resolve(`${targetDirectory}/${member}.${suffix}`);
                                const fromPath = sourceFilePath;
                                const toPath = targetFilePath;
                                const fromPathMeta = `${sourceFilePath}${META_XML}`;
                                const toPathMeta = `${targetFilePath}${META_XML}`;
                                console.log(typeof metaFile);
                                const filecopyresult = await copyFilePromiseMaker({fromPath,toPath});
                                console.log('File Copy Result',filecopyresult);
                                let metafilecopyresult = '';
                                if(metaFile){
                                    
                                    metafilecopyresult = await copyFilePromiseMaker({fromPath:fromPathMeta,toPath:toPathMeta});
                                }
                            return `Copied ${filecopyresult} ${metafilecopyresult!==''?`and ${metafilecopyresult}`:''}`; 
                            }catch(err){
                                throw err;
                            }
                            
                    }));
                    allResults.fileCopyResults = fileCopyResults;
                }


             return allResults;
            } catch (err) {
                throw err;
            }

        }))
    
        return packageFileResults;
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