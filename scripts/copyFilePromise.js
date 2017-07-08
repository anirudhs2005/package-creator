const quickCopyFile = require('quickly-copy-file');

function copyFilePromiseMaker({fromPath,toPath}={}){
	return new Promise((resolve,reject)=>{
		 quickCopyFile(fromPath,toPath, (err)=>{
		 	if(err){
		 		reject(err);
		 	}else{
		 		resolve(`Created file from ${fromPath} to ${toPath}`);
		 	}
		 })
	})
}

module.exports.copyFilePromiseMaker = copyFilePromiseMaker;