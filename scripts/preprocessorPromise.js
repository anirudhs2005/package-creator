const {CustomError} = require('./errorGenerator');
const {constants} = require('./constantsStore');
function defaultCleanser(parseResult,resolve,reject){
		try{
			/**
			 * As part of cleasing of data, we have classified the static errors into three types.
			 * 1. Data itself is empty.
			 * 2. The Type is Empty or the Members are empty or both.
			 * 3. If Type is present and one of the members is Empty
			 *
			 * If all these are fine, then remove trailing spaces from the type and members.
			 * Also replace members with unique members
			 */
			const spaceRegex = constants.SPACE_REGEX;
			let {data=[],filePath,version} = parseResult;
			
			if(data.length==0){
				throw new CustomError(constants.NO_DATA,constants.NO_DATA_MESSAGE,filePath);
			}
			
			data = data.map((d,i)=>{
				if(!d.type || !d.type.replace(spaceRegex,'').length || !d.members || d.members.length===0){
					throw new CustomError(constants.EMPTY_TYPE_OR_MEMBERS,constants.EMPTY_TYPE_MESSAGE,filePath,d.type);
					d.members.forEach((member,i)=>{
 							if(!member || !member.replace(spaceRegex,'').length){
 								throw new CustomError(constants.NULL_MEMBER,constants.NULL_MEMBER_MESSAGE,filePath,d.type,i);
 							}
 							
					});
				}
				//Find the unique members in that type after trimming the members and return the result
				return {type:d.type.trim(), members:[...new Set(d.members.map(m=>m.trim()))]};
			});
			//Place back the cleansed data into the original parse result
			parseResult.data = data;
			resolve(parseResult);


		}catch(err){
			reject(err);
		}
}

function preprocessorPromiseMaker(parseResult,cleanser=defaultCleanser){
	 const preprocessPromise = new Promise(function(resolve,reject){
	 		cleanser(parseResult,resolve,reject);
	 });
	 return preprocessPromise;
}

module.exports = preprocessorPromiseMaker;