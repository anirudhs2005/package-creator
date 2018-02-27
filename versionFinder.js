const promisify = require('promisify-node');
const path = require('path');
const fsp = promisify('fs');
const {
    constants
} = require('./scripts/constantsStore');
const {
    describeMetadataPromise
} = require('./scripts/describeMetadataPromise');

const {
    extractComponentsWithMetaFilePromiseMaker
} = require('./scripts/extractComponentsWithMetaFilePromise');

const orgXMLPath = `./outputs/EntireOrgPackage.xml`;

async function generateVersionReport() {
    try {
        const describeMetadataResult = await describeMetadataPromise();
        const {
            metadataObjects
        } = describeMetadataResult;

        const metadataObjectsWithMetaFile = await extractComponentsWithMetaFilePromiseMaker(metadataObjects);
        
        return metadataObjectsWithMetaFile;

    } catch (e) {
    	throw e;
    }
}

generateVersionReport().then((res)=>{
	console.log(res);
}).catch((e)=>console.log(e));