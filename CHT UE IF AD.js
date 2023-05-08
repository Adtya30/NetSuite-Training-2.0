/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record','N/search'],

function(record,search) {
   
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
    	try{
    		log.debug('In before load Function');
    		
    		var newRecord = scriptContext.newRecord;
    		
//    		Get the field Value 'Created from'
    		var createdFrom = newRecord.getValue({
    	        fieldId: 'createdfrom'
    	    });
    		log.debug('createdFrom',createdFrom);   		
    		
//	        Get the lineCount of item
			var item = newRecord.getLineCount({
    			sublistId: 'item'
        	});        		
    		log.debug('item',item);
    		
//    		Get item name through for loop
    		for(var count = 0; count < item; count++){
    			var itemName = newRecord.getSublistValue({
    				sublistId: 'item',
    	            fieldId: 'item',
    	            line: count
    			});
    		log.debug('itemName',itemName);
    			
//	        Create Saved Search for item fullfillment
    		var itemfulfillmentSearchObj = search.create({
    			   type: "itemfulfillment",
    			   filters:
    			   [
    			      ["type","anyof","ItemShip"], 
    			      "AND", 
    			      ["createdfrom","anyof",createdFrom], 
    			      "AND", 
    			      ["item","anyof",itemName]
    			   ],
    			   columns:
    			   [
    			      search.createColumn({name: "tranid"}),
    			     
    			   ]
    			});
    			var searchResultCount = itemfulfillmentSearchObj.runPaged().count;
    			log.debug("itemfulfillmentSearchObj result count",searchResultCount);
    			
    			
    			var itemFullfillment = '';
    			itemfulfillmentSearchObj.run().each(function(result){
    				
    			itemFullfillment += result.getValue('tranid') + '/';
    			log.debug("itemFullfillment",itemFullfillment);
    			
    			
//    			Set Item fulfillment number in Item Fulfillment field
    			newRecord.setSublistValue({
    				sublistId: 'item',
    				fieldId: 'custcol_item_fullfillment_no_ad',
    				line: count,
    				value: itemFullfillment
    			});
    			   // .run().each has a limit of 4,000 results
    			   return true;
    			});

    		}	        
    	}catch(e){
    		log.error('Error in before load function :',e);
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

    }

    return {
        beforeLoad: beforeLoad,
//        beforeSubmit: beforeSubmit,
//        afterSubmit: afterSubmit
    };
    
});
