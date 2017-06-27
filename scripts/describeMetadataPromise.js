const jsforce = require('jsforce');
const {
    constants
} = require('./constantsStore');
const {
    loginPromiseMaker
} = require('./loginPromise');
const {
    CustomError
} = require('./errorGenerator');
const dotenv = require('dotenv').config({
    path: './config/vars.env'
});


async function describeMetadataProcess(config) {
    try {
        const {
            version
        } = config;
        if (!version || parseFloat(version) <= 0) {
            const {
                INVALID_RETRIEVE_VERSION,
                INVALID_RETRIEVE_VERSION_MESSAGE
            } = constants;
            throw new CustomError(INVALID_RETRIEVE_VERSION, INVALID_RETRIEVE_VERSION_MESSAGE);
        }

        const {connection} = await loginPromiseMaker();
        const describeResult = await connection.metadata.describe(version);
        
        return describeResult;



    } catch (err) {
        throw err;
    }
}

function describeMetadataPromiseMaker({
    version = process.env.SF_RETRIEVE_VERSION
} = {
    version: process.env.SF_RETRIEVE_VERSION
}) {
   
    return describeMetadataProcess({version});
}

module.exports.describeMetadataPromise = describeMetadataPromiseMaker;