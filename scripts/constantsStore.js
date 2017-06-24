function constantsStore(){

}
const cp = constantsStore.prototype;

cp.XML = '.xml';
cp.CSV ='.csv';
cp.NO_DATA = 'NO_DATA';
cp.NO_DATA_MESSAGE = 'No data present in the file';
cp.EMPTY_TYPE_OR_MEMBERS='EMPTY_TYPE_OR_MEMBERS';
cp.EMPTY_TYPE_MESSAGE = 'Either Type is empty or Members is totally empty ';
cp.NULL_MEMBER ='NULL_MEMBER';
cp.NULL_MEMBER_MESSAGE = 'The name of the resource is not defined';
cp.NULL_LOGIN_CREDENTIALS = 'NULL_LOGIN_CREDENTIALS';
cp.FORMAT_ENV_FILE=`
	SF_USER_NAME
	SF_PASSWORD=
    SF_LOGIN_URL=
    SF_ACCESS_TOKEN=`
cp.NULL_LOGIN_CREDENTIALS_MESSAGE = `Either username and password(+secToken) or access Token or instanceUrl is not defined. 
                                        Please configure them under config folder inside the vars.env folder
										${FORMAT_ENV_FILE}
										Please note : No quotes are required for the environment variables
                                        `;

exports.constants = new constantsStore();