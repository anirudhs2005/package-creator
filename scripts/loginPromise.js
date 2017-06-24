const jsforce = require('jsforce');
const dotenv = require('dotenv').config({
    path: './config/vars.env'
});
const {
    constants
} = require('./scripts/constantsStore');
const {
    CustomError
} = require('./scripts/errorGenerator');


function doLogin(config, resolve, reject) {
    try {
        const {
            username,
            password,
            instanceUrl,
            accessToken
        } = config;


        if (!((username && password) || accessToken) && !instanceUrl) {
            const {
                NULL_LOGIN_CREDENTIALS,
                NULL_LOGIN_CREDENTIALS_MESSAGE
            } = constants;
            throw new CustomError(NULL_LOGIN_CREDENTIALS, NULL_LOGIN_CREDENTIALS_MESSAGE);
        }

        //TO DO : activity of login and design for new login
       
    } catch (err) {
        reject(err);
    }
}






function loginPromiseMaker({
    username = process.env.SF_USER_NAME,
    password = process.env.SF_PASSWORD,
    instanceUrl = process.env.SF_LOGIN_URL,
    accessToken = process.env.SF_ACCESS_TOKEN
}) {
    const loginPromise = new Promise(function(resolve, reject) {

    });
    return loginPromise;
}

module.exports.loginPromiseMaker = loginPromiseMaker;