 const fastcsv = require('fast-csv');
 
 function csvReader(headers2Parse,filePath,resolve,reject){
 	  let csvReadResult = {
            filePath,
            data: [],
            version: ''
      };
      const name = headers2Parse.Name;
      const type = headers2Parse.Type;
      try{
      	fastcsv
      		.fromPath(filePath,{headers:true})
            .on('data',(data)=>{
            	const resource = data[name];
            	const resourceType = data[type];
            	csvReadResult.data.push({Name:resource,Type:resourceType});
            })
            .on('end', function(){
            	resolve(csvReadResult);
            })
      }catch(err){
      	reject(err);
      }
 }

 function csv2ObjectPromiseMaker({headers2Parse={Name:'Name',Type:'Type'},filePath,customParser=csvReader}){
 	

 	let csv2ObjectPromise = new Promise(function(resolve,reject){
 			customParser(headers2Parse,filePath,resolve,reject)
 	});
 	return csv2ObjectPromise;
 }

 module.exports = csv2ObjectPromiseMaker;