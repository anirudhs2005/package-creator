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

        /**
         * 1. Find the folders to create
         * 2. 
         */
        const metadataByXmlName = new Map();
        metadata.forEach(mdata => {
        	metadataByXmlName.set(mdata.xmlName,mdata);
        });
        let folders2Create = new Set();
        consolidatedParseResults.forEach(({type,members}, i) => {
        	const {directoryName,inFolder,metaFile,suffix} = metadataByXmlName.get(type);
        	folders2Create.add(directoryName);
        });
        
        const targetPath = `../outputs/deployments/`


    } catch (err) {
        reject(err);
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
    const createFoldersPromise = new Promise((resolve, reject) => {
        createFolders({
            source,
            target,
            consolidatedParseResults
        }, resolve, reject);
    });
    return createFoldersPromise;
}

module.exports.createFoldersPromiseMaker = createFoldersPromiseMaker;