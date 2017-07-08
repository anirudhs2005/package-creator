/** Class Name  : HSvc_PicklistController
*  Description  : This class is Controller which encapsulates the driving logic for HSvc_Picklist component
*  Created By   : Avinash Yaramilli
*  Created On   : 19-Jul-2015
*
*  Modification Log:
*  --------------------------------------------------------------------------------------------------------------------------------------
*   Developer                Date                   Modification ID      Description
*  ---------------------------------------------------------------------------------------------------------------------------------------
*/
Public with sharing class HSvc_PicklistController {

    public Case caseObjInstance {get; set;}
    public String picklistField {get; set;}
    public List<SelectOption> fieldNames {get; set;}



    /**Method description : The method to return values of a Lookup from External object
    * @param  : none
    * @return : List<SelectOption>
    **/
    public List<SelectOption> getValues() {
        fieldNames = new List<SelectOption>();
        //fieldNames.add(new SelectOption('',System.Label.HSvc_None));
        if (('HSvc_ActivityTypeLookup__c').equalsIgnoreCase(picklistField)) {
            activityTypeValues();
        }
        if (('De_Escalation_Code__c').equalsIgnoreCase(picklistField)) {
            DeEscalationCodeValues();
        }
        return fieldNames;
    }

    /**Method description : To return Activity Type values
    * @param  : none
    * @return : void
    **/
    private void activityTypeValues() {
        if (caseObjInstance.RecordTypeId != null) {
            Schema.DescribeSObjectResult d = Schema.SObjectType.Case;
            Map<Id, Schema.RecordTypeInfo> rtMapById = d.getRecordTypeInfosById();
            String recordTypeName =  rtMapById.get(caseObjInstance.RecordTypeId).getName();
            system.debug('###recordTypeName:->' + recordTypeName);
            List<Hsvc_ActivityType__c> LstActbyName = HSvc_ActivityTypeAccessor.find(recordTypeName);
            system.debug('###LstActbyName:->' + LstActbyName);
            HSvc_Custom_Labels__c AgentNoteobj = HSvc_Custom_Labels__c.getInstance('Hsvc_Agent_Note');
            system.debug('###AgentNoteobj:->' + AgentNoteobj);
            if (LstActbyName != null && LstActbyName.size() > 0) {
                for (Hsvc_ActivityType__c actList : LstActbyName) {
                    if (AgentNoteobj != null && String.isNotBlank(AgentNoteobj.Message__c) && AgentNoteobj.Message__c.equalsIgnoreCase(actList.ActivityCode__c))
                        caseObjInstance.HSvc_ActivityTypeLookup__c = actList.Id;
                    fieldNames.add(new SelectOption(actList.id, actList.Activity_Name_Formula__c));
                }
            }

            else {
                fieldNames.add(new SelectOption('', System.Label.HSvc_None));
            }
        }
    }
    /**Method description : To return Activity Type values
    * @param  : none
    * @return : void
    **/
    private void DeEscalationCodeValues() {
        if (caseObjInstance.RecordTypeId != null) {
            Schema.DescribeSObjectResult d = Schema.SObjectType.Case;
            Map<Id, Schema.RecordTypeInfo> rtMapById = d.getRecordTypeInfosById();
            String recordTypeName =  rtMapById.get(caseObjInstance.RecordTypeId).getName();
            List<YAHS_DeEscalationCode__c> LstDeEscalationCodes = YAHS_DeEscalationCodeAccessor.find(recordTypeName);
            if (LstDeEscalationCodes != null && LstDeEscalationCodes.size() > 0) {
                fieldNames.add(new SelectOption('', System.Label.HSvc_None));
                for (YAHS_DeEscalationCode__c deEscalationCode : LstDeEscalationCodes) {
                    fieldNames.add(new SelectOption(deEscalationCode.id, deEscalationCode.De_escalation_Description_Formula__c));
                }
            }

            else {
                fieldNames.add(new SelectOption('', System.Label.HSvc_None));
            }
        }
    }
}