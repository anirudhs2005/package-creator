const jsforce = require('jsforce');
const dotenv = require('dotenv').config({
    path: './config/vars.env'
});
const {
    constants
} = require('./constantsStore');
const {
    CustomError
} = require('./errorGenerator');

/**
 * [doLogin description]
 * @param  {[type]} config  [
            username = username,
            password = usern,
            instanceUrl = either login url or anything else,
            accessToken = If you already have the token, then please enjoy this
        }]
 * @param  {[type]} resolve [resolver object of the initial promise]
 * @param  {[type]} reject  [rejector]
 * @return {[type]} {connection,userInfo}    [description]
 */
async function doLogin(config) {

    try {
        const {
            username,
            password,
            instanceUrl,
            accessToken
        } = config;
        console.log('Logging into Salesforce', username, password, instanceUrl);

        if (!((username && password) || accessToken) || !instanceUrl) {
            const {
                NULL_LOGIN_CREDENTIALS,
                NULL_LOGIN_CREDENTIALS_MESSAGE

            } = constants;
            throw new CustomError(NULL_LOGIN_CREDENTIALS, NULL_LOGIN_CREDENTIALS_MESSAGE);

        }

        if (username && password && accessToken) {
            const {
                INVALID_MIXTUREOF_CREDENTIALS,
                INVALID_MIXTUREOF_CREDENTIALS_MESSAGE
            } = constants;
            throw new CustomError(INVALID_MIXTUREOF_CREDENTIALS, INVALID_MIXTUREOF_CREDENTIALS_MESSAGE);
        }


        let newConnection;
        if (username && password) {
            newConnection = new jsforce.Connection({
                loginUrl: instanceUrl
            });
            await newConnection.login(username, password);


        } else {
            newConnection = new jsforce.Connection({
                accessToken,
                instanceUrl
            });
        }


        console.log(`Successfully logged into Salesforce ${username}`);
        return {
            connection: newConnection
        };






    } catch (err) {
        throw err;
    }
}


function loginPromiseMaker({
    username = process.env.SF_USER_NAME,
    password = process.env.SF_PASSWORD,
    instanceUrl = process.env.SF_LOGIN_URL,
    accessToken = process.env.SF_ACCESS_TOKEN
} = {
    username: process.env.SF_USER_NAME,
    password: process.env.SF_PASSWORD,
    instanceUrl: process.env.SF_LOGIN_URL,
    accessToken: process.env.SF_ACCESS_TOKEN
}) {
    return doLogin({
            username,
            password,
            instanceUrl,
            accessToken
        });
}

module.exports.loginPromiseMaker = loginPromiseMaker;