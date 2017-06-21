const xml2object = require('xml2object'),
    fs = require('fs');

function xml2ObjectPromiseMaker(tags, filePath) {
    let xmlReadResult = {
        filePath,
        data: [],
        version:''
    };
    let xml2objectPromise = new Promise(function(resolve, reject) {
        try {
            let source = fs.createReadStream(filePath);
            let parser = new xml2object(tags, source);
            parser.on('object', (name, obj) => {
                if (name === 'types') {
                    let {
                        members,
                        name: type

                    } = obj;
                    //If there is only a single member, then a string is returned.
                    //Converting it to array
                    if (typeof members === 'string') {
                        members = [members];
                    }
                    xmlReadResult.data.push({
                        type,
                        members
                    })
                }
                if(name ==='version'){
                    xmlReadResult.version = obj.$t;
                }
                


            });
            parser.on('end', () => {
                resolve(xmlReadResult);
            });
            parser.start();
        } catch (err) {
            reject(err);
        }

    });

    return xml2objectPromise;
}

module.exports = xml2ObjectPromiseMaker;