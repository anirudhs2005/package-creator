const {constants} = require('./constantsStore');
const {CustomError} = require('./errorGenerator');
const path = require('path');

function validateMetadata(metadata=[],processParseResults=[],resolve,reject){
		console.log('Validating types against folderStructure.json')
		try{
			if(!metadata.length){
				const {INVALID_METADATA,INVALID_METADATA_MESSAGE} = constants;
				throw new CustomError(INVALID_METADATA,INVALID_METADATA_MESSAGE);
			}

			if(!processParseResults.length){
				const {INVALID_PARSE_RESULTS,INVALID_PARSE_RESULTS_MESSAGE} = constants;
				throw new CustomError(INVALID_PARSE_RESULTS,INVALID_PARSE_RESULTS_MESSAGE);
			}
			
			const metanamesHash = new Set(metadata.map(m=>m.xmlName));

			processParseResults.forEach(({data,filePath,version})=>{
					data.forEach((d,i)=>{
						const {type} = d;
						if(!metanamesHash.has(type)){
							const {XML,CSV,INVALID_TYPE,INVALID_TYPE_MESSAGE} = constants;
							throw new CustomError(INVALID_TYPE,INVALID_TYPE_MESSAGE,filePath,type, path.extname===CSV?i:undefined);
						}
					});
			});

			resolve({areTypesValid:true});


		}catch(err){
			reject(err);
		}
}


function validateMedataPromiseMaker(metadata,processParseResults,validator=validateMetadata){
	const validateMedataPromise = new Promise((resolve,reject)=>{
			validator(metadata,processParseResults,resolve,reject);
	});
	return validateMedataPromise;
}



module.exports.validateMedataPromiseMaker = validateMedataPromiseMaker;