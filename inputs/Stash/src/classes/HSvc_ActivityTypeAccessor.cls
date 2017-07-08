/** Class Name   : HSvc_ActivityTypeAccessor
*  Description  : Convenience class that encapsulates reads and writes to the HSvc_ActivityType object. Enforces data integrity and other rules that may be necessary.
*  Created By   : Avinash Yaramilli
*  Created On   : 19-Jul-2015
*
*  Modification Log:  
*  --------------------------------------------------------------------------------------------------------------------------------------
*   Developer                Date                   Modification ID      Description 
    Abhijit Debadutta       3rd September 2015          M-0001          Bulkified find method
*  ---------------------------------------------------------------------------------------------------------------------------------------
*/

public with sharing class HSvc_ActivityTypeAccessor{
    /**Method description : Returns the List Of Activity types applicable for set of parameters
* @param  : String recordType 
* @return : List<HSvc_ActivityType__c>
**/
    public static List<HSvc_ActivityType__c> find(String recordType){
       
        List<HSvc_ActivityType__c> activityList=[select Id,Activity_Name_Formula__c,Activity_Name_Portuguese__c,Activity_Code_Portuguese__c, Name,ActivityCode__c, AvailableToUser__c, Description__c, RecordType__c from HSvc_ActivityType__c where toLabel(RecordType__c) =:recordType and HSvc_EffectiveDate__c <=: System.Today() AND HSvc_ExpiryDate__c >=: System.Today() and AvailableToUser__c=true  ORDER BY Name ASC];
        return activityList;
    }
        /**Method description : Returns the List Of Activity types applicable for set of parameters
* @param  : none 
* @return : List<HSvc_ActivityType__c>
**/
    public static List<HSvc_ActivityType__c> findAll(){
        List<HSvc_ActivityType__c> activityList=[select Id, Name, ActivityCode__c, AvailableToUser__c,Description__c, RecordType__c  from HSvc_ActivityType__c where HSvc_EffectiveDate__c <=: System.Today() AND HSvc_ExpiryDate__c >=: System.Today()];
        return activityList;
    }
     /**Method description : Returns the List Of Activity types applicable for set of parameters
* @param  : set<String> recordType 
* @return : List<HSvc_ActivityType__c>
**/
    public static Map<Id,HSvc_ActivityType__c> find(Set<String> recordType){
        Map<Id,HSvc_ActivityType__c> activityList=new map<Id,HSvc_ActivityType__c>([select Id, Name,ActivityCode__c, AvailableToUser__c,Description__c, RecordType__c from HSvc_ActivityType__c where toLabel(RecordType__c) IN:recordType and HSvc_EffectiveDate__c <=: System.Today() AND HSvc_ExpiryDate__c >=: System.Today() and AvailableToUser__c=true]);
        return activityList;
    }
    /**Method description : Returns the activity type based on the code.
* @param  : set<String> recordType 
* @return : List<HSvc_ActivityType__c>
**/
    public static Map<String,Id> getActTypeByCode(List<String> l_code){
        Map<String,Id> mp_actTyp = new Map<String,Id>();
        if(l_code != null && !l_code.IsEmpty()){
            List<HSvc_ActivityType__c> activityList = new List<HSvc_ActivityType__c>();
            try{
                activityList = [Select Id,ActivityCode__c From HSvc_ActivityType__c Where ActivityCode__c IN:l_code];
            }
            catch(Exception e){
                system.debug('Exception occured in HSvc_ActivityTypeAccessor.getActTypeByCode');
                return null;
            }
            if(activityList !=null && !activityList.isEmpty()){
                for(HSvc_ActivityType__c hact:activityList){
                    mp_actTyp.put(hact.ActivityCode__c,hact.Id);                
                }
            return mp_actTyp;   
            }   
            return null;            
        }
        return null;    
    }
}