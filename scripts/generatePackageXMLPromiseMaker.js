const {pd} = require('pretty-data');
const dotenv = require('dotenv').config({
    path: './config/vars.env'
});
function generatePackageXMLPromiseMaker(consolidatedData=[]){
	return new Promise((resolve,reject)=>{
		const packageXMLString = `<?xml version="1.0" encoding="UTF-8"?>
			<Package xmlns="http://soap.sforce.com/2006/04/metadata">
				${[...consolidatedData]
								 .map(([type,members])=>
								       `<types>
										   ${type.indexOf('CustomLabel')!==-1?'<members>*</members>':`${members.map(member=>`<members>${member}</members>`).join('')}`}
										   <name>${type}</name>
										</types>
								       `
								     ).join('')
				 }
				<version>${process.env.SF_RETRIEVE_VERSION}</version>
		    </Package>`;
		const prettyXML = pd.xml(packageXMLString);
		resolve(prettyXML);

	});
}
module.exports.generatePackageXMLPromiseMaker = generatePackageXMLPromiseMaker;