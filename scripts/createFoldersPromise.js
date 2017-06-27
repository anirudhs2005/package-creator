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



const path = require('path');

async function createFolders(config, resolve, reject) {
    try {
        //TO DO: Validate source,
        const {
            source,
            target,
            metadata,
            consolidatedParseResults
        } = config;
        
        const programOutputFolder = process.env.SF_PROGRAM_OUTPUT_FOLDER;
        const deploymentPackageFolder = process.env.SF_TO_DEPLOY_FOLDER_NAME;
      
        //TO DO : Validate deploymentPackageFolder,programOutputFolder
        /**
         * 1. Find the folders to create
         * 2. 
         */
        const metadataByXmlName = new Map();
        metadata.forEach(mdata => {
        	metadataByXmlName.set(mdata.xmlName,mdata);
        });
        let folders2Create = new Set();

        for(const [type,members] of consolidatedParseResults){
        	const {directoryName,inFolder,metaFile,suffix} = metadataByXmlName.get(type);
        	folders2Create.add(directoryName);
        }
       
        folders2Create = [...folders2Create];

        const targetPath = `${programOutputFolder}/${deploymentPackageFolder}`;
        const resolvedTargetPath = path.resolve(targetPath);
        await fsp.mkdir(resolvedTargetPath);
        const folderCreationResults = await Promise.all(folders2Create.map(async folder =>{
        	const folderPath =path.resolve(`${resolvedTargetPath}/${folder}`);
        	await fsp.mkdir(folderPath);
        	return `Created ${folderPath}`;
        }));

        return folderCreationResults;

     	


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