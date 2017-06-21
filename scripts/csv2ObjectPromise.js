 const fastcsv = require('fast-csv');
 //Default Reader
 function csvReader(headers2Parse, filePath, resolve, reject) {
     let csvReadResult = {
         filePath,
         data: [],
         version: ''
     };
     const name = headers2Parse.Name;
     const type = headers2Parse.Type;
     let extracted_data = [],
         transformed_data = [];
     try {
         //_membersByType --->[{type:'ApexClass', members:['MyClass','MySiteClass']}]
         let membersByType = {},
             _membersByType = [];
         fastcsv
             .fromPath(filePath, {
                 headers: true
             })
             .on('data', (data) => {
                 const resource = data[name];
                 const resourceType = data[type];
                 extracted_data.push({
                     Name: resource,
                     Type: resourceType
                 });
             })
             .on('end', function() {

                 extracted_data.forEach(d => {
                     const type = d.Type;
                     const resource = d.Name;

                     if (membersByType[type]) {
                         membersByType[type].push(resource);
                     } else {
                         membersByType[type] = [resource];
                     }

                 });

                 //Convert membersByType to {type: , "members" ; []} so that we can eventually convert it to an array
                 for (const type in membersByType) {
            
                     _membersByType.push({type,members: membersByType[type]});

                 }
           
                 csvReadResult.data = _membersByType;
                 resolve(csvReadResult);
             });
     } catch (err) {
         reject(err);
     }
 }

 /**
  * [csv2ObjectPromiseMaker Makes the promise required to parse a csv file into an object]
  * @param  {Object} options.headers2Parse [Which headers of the CSV file must be considered]
  * @param  {[type]} filePath              [The FilePath]
  * @param  {[type]} customParser          [Encapsulates the Parsing of CSV]
  * @return {[type]}                       [A Promise that eventually returns either an error or csvReadResult]
  */
 function csv2ObjectPromiseMaker({
     headers2Parse = {
         Name: 'Name',
         Type: 'Type'
     },
     filePath,
     customParser = csvReader
 }) {


     let csv2ObjectPromise = new Promise(function(resolve, reject) {
         customParser(headers2Parse, filePath, resolve, reject)
     });
     return csv2ObjectPromise;
 }

 module.exports = csv2ObjectPromiseMaker;