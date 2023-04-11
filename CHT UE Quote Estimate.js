/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/email', 'N/record', 'N/runtime'],
/**
 * @param {email} email
 * @param {record} record
 * @param {runtime} runtime
 */
function(email, record, runtime) {
   
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
    		log.debug("In after submit");
			if(scriptContext.type == 'edit'){
				
				var estRec = scriptContext.newRecord;
				var currentuser = runtime.getCurrentUser().id;
				log.debug('currentuser:',currentuser);
				
				var custName = estRec.getValue('entity');
				log.debug('custName:',custName);
				if(custName){
					var custRec = record.load({
						type : record.Type.CUSTOMER,
						id : custName
					})

					log.debug('Cust Record');
					var custEmail = custRec.getValue('email');	
					log.debug('custEmail:',custEmail);
//					var emailArr = [];
//					emailArr.push(custEmail);
					
					if(custEmail){
						email.send({
							author:currentuser,
							recipients: custEmail,
							subject: 'Estimate status',
							body: 'Estimate created Successfully',

						});
						log.debug('Email sent');
					}
				}
			}


    		
    	}catch(e){
    		alert('Error in beforeSubmit Function',e);
    	}

    }

    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };
    
});
