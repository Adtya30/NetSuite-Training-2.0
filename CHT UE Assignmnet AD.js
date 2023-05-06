/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record','N/email'],

function(record,email) {
   
    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {string} scriptContext.type - Trigger type
     * @param {Form} scriptContext.form - Current form
     * @Since 2015.2
     */
    function beforeLoad(scriptContext) {

    }

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function beforeSubmit(scriptContext) {
    	
    }

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function afterSubmit(scriptContext) {
    	try{
    		log.debug('In After Submit Function ');
    	
    		var newRecord = scriptContext.newRecord;
    		
    		var salesOrderID = scriptContext.newRecord.id;
    		log.debug('salesOrderID',salesOrderID);
    		
    		var item = newRecord.getLineCount({
    			sublistId: 'item'
        	});
    		
    		log.debug('item',item);
    		
    		var emailBody='';
    		
    		for(var lineCount = 0;lineCount < item; lineCount++){
        			
        		itemName = newRecord.getSublistText({
        			sublistId: 'item',
        			fieldId : 'item',
        			line: lineCount
        		});	
        		log.debug('itemName',itemName);
        		
        		emailBody += ('<body>Your Customer id is :'+salesOrderID+ '<br> Your item name is :'+itemName+'<br></body>');
        	}
    		

    		var recipient = 'customer@gmail.com';
    		var subject = 'Sales Order Created Successfully';
    		 
    		
    		email.send({
    		    author: 25659,
    		    recipients: recipient,
    		    subject: subject,
    		    body: emailBody
    		});
    		
    	}catch(e){
    		log.error('Error in After Submit :',e);
    	}
    }

    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };
    
});