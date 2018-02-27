function extractComponentsPromiseMaker(metadataObjects){
	const extractComponentsPromise = new Promise((resolve,reject)=>{
			try{
				const metadataObjectsWithMetaFile = metadataObjects.filter(metadataObject=>metadataObject.metaFile);
				resolve(metadataObjectsWithMetaFile);
			}catch(e){
				reject(e);
			}
	});
	return extractComponentsPromise;
}

module.exports.extractComponentsWithMetaFilePromiseMaker = extractComponentsPromiseMaker;