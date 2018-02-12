const {
    pd
} = require('pretty-data');
const dotenv = require('dotenv').config({
    path: './config/vars.env'
});

function wildCardXMLGenerator(describeMetadataResults) {
    const wildCardXMLPromise = new Promise((resolve, reject) => {
                try {
                    const packageXMLString = `<?xml version="1.0" encoding="UTF-8"?>
					<Package xmlns="http://soap.sforce.com/2006/04/metadata">
					${describeMetadataResults.map(describeResult=>`
									<types>
										<members>*</members>
										<name>${describeResult.xmlName}</name>
									</types>

						`).join('')}
					<version>${process.env.SF_RETRIEVE_VERSION}</version>
					</Package>			

	  			`;
	  		const prettyXML = pd.xml(packageXMLString);
			resolve(prettyXML);
	  		}catch(err){
	  			reject(err);
	  		}
	  });
	  return wildCardXMLPromise;
}

module.exports.createStarBasedPackageXMLPromise = function createStarBasedPackageXMLPromise(describeMetadataResults) {
    return wildCardXMLGenerator(describeMetadataResults);
}