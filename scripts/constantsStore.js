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

exports.constants = new constantsStore();