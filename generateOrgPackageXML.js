const promisify = require('promisify-node');
const path = require('path');
const fsp = promisify('fs');
const {
    constants
} = require('./scripts/constantsStore');
const {
    describeMetadataPromise
} = require('./scripts/describeMetadataPromise');
const {createStarBasedPackageXMLPromise} = require('./scripts/createStarBasedPackageXMLPromiseMaker');
const orgXMLPath = `./outputs/EntireOrgPackage.xml`;
async function generatePackageXML() {
    try {
        const describeMetadataResult = await describeMetadataPromise();
        const {
            metadataObjects
        } = describeMetadataResult;
        const prettyXML = await createStarBasedPackageXMLPromise(metadataObjects);
        await fsp.writeFile(orgXMLPath,prettyXML);
        return orgXMLPath;
    } catch (e) {
    		throw e;
    }

}

generatePackageXML()
				  .then((result) => console.log(`Generated package.xml @ ${result}`))
				  .catch((e)=>console.log(e))