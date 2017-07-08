function constantsStore(){

}
const cp = constantsStore.prototype;


const FORMAT_ENV_FILE = `
SF_USER_NAME=
SF_PASSWORD=
SF_LOGIN_URL=
SF_ACCESS_TOKEN=
SF_RETRIEVE_VERSION=
`;
cp.SPACE_REGEX=/\s/g
cp.XML = '.xml';
cp.CSV ='.csv';
cp.NO_DATA = 'NO_DATA';
cp.NO_DATA_MESSAGE = 'No data present in the file';
cp.EMPTY_TYPE_OR_MEMBERS='EMPTY_TYPE_OR_MEMBERS';
cp.EMPTY_TYPE_MESSAGE = 'Either Type is empty or Members is totally empty ';
cp.NULL_MEMBER ='NULL_MEMBER';
cp.NULL_MEMBER_MESSAGE = 'The name of the resource is not defined';
cp.NULL_LOGIN_CREDENTIALS = 'NULL_LOGIN_CREDENTIALS';
cp.FORMAT_ENV_FILE=FORMAT_ENV_FILE;
cp.NULL_LOGIN_CREDENTIALS_MESSAGE = `
Either username and password(+secToken) 
or access Token or instanceUrl is not defined. 
Please configure the variables between #COPY and #END COPY inside the configs folder vars.env
###COPY
${FORMAT_ENV_FILE}
###END COPY
Please note : No quotes are required for the environment variables`;
cp.INVALID_MIXTUREOF_CREDENTIALS = 'INVALID_MIXTUREOF_CREDENTIALS';
cp.INVALID_MIXTUREOF_CREDENTIALS_MESSAGE = 'Cannot have both username-password and access token';                                      
cp.INVALID_RETRIEVE_VERSION='INVALID_RETRIEVE_VERSION';
cp.INVALID_RETRIEVE_VERSION_MESSAGE = 'Please specify a version to metadata to retrieve inside config/vars.env';
cp.FOLDER_STRUCTURE_FILE= 'folderStructure.json';
cp.INVALID_METADATA = 'INVALID_METADATA';
cp.INVALID_METADATA_MESSAGE = 'Either metadata is empty or not defined. Please check if you have called the describeMetadata method';
cp.INVALID_PARSE_RESULTS = 'INVALID_PARSE_RESULTS';
cp.INVALID_PARSE_RESULTS_MESSAGE = 'Parse Results is empty. Please pass a non-empty array of results to be validated';
cp.INVALID_TYPE='INVALID_TYPE';
cp.INVALID_TYPE_MESSAGE = 'The Type you have mentioned isn\'t present in the org you are deploying to. Please check the xml name of the folderStructure.json file';
cp.FOLDER_PATH_INVALID = 'FOLDER_PATH_INVALID';
cp.FOLDER_PATH_INVALID_MESSAGE  =`Invalid syntax for folder path. 
Give the folder name of the component followed by / and fileName
Example: unfiled$public/MyReport`;
cp.META_XML= '-meta.xml';


exports.constants = new constantsStore();