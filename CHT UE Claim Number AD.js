/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
 define(['N/search','N/error'],

 function(search,error) {
	
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
			 log.debug('In Before Submit Function');
 
			if (scriptContext.type === 'create' || scriptContext.type === 'edit') {
				 var newRecord = scriptContext.newRecord;
				 
				var claimNumber = newRecord.getValue({
				fieldId :'custentity_claim_number_ad'
			 	});
			 	log.debug('claimNumber',claimNumber);
			 
 // Performs a save search
			if(claimNumber){
				 var jobSearchObj = search.create({
						type: "job",
						filters:
						[
						   ["custentity_claim_number_ad","startswith",claimNumber]
						],
						columns:
						[
						   search.createColumn({name: "altname", label: "Name"}),
						   search.createColumn({name: "custentity_claim_number_ad", label: "Claim Number AD"})
						]
					 });
					 var searchResultCount = jobSearchObj.runPaged().count;
					 log.debug("jobSearchObj result count",searchResultCount);
					 
					 var searchclaimNumber;
					 jobSearchObj.run().each(function(result){
						 
					 searchclaimNumber = result.getValue('custentity_claim_number_ad');
					 log.debug('searchClaimNumber',searchclaimNumber);
						// .run().each has a limit of 4,000 results
						return true;
					 });
			 
				 // check if another project record with the same claim number already exists
					 var messages = ('This Claim Number is already exist in our system :',claimNumber);
					 if(searchclaimNumber === claimNumber){
						 log.debug('Project with this claim number already exist in NetSuite')
						 
						 var custom_error = error.create({
							 name: 'Claim Number',
							 message: messages,
							 notifyoff:false
				 });
						 throw custom_error.message
					 }			

			}
			}
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
	 }
 
	 return {
		 beforeLoad: beforeLoad,
		 beforeSubmit: beforeSubmit,
		 afterSubmit: afterSubmit
	 };
	 
 });
 