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
    		
//    		Load the Sales Order
	        var salesOrder = record.load({
	        	type: record.Type.SALES_ORDER,
	        	id: createdFrom
	        });
	        log.debug('salesOrder',salesOrder);
	        
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
    			
    			
//	        Create Saved Search for item fullfillment
    		var itemfulfillmentSearchObj = search.create({
    			   type: "itemfulfillment",
    			   filters:
    			   [
    			      ["type","anyof","ItemShip"], 
    			      "AND", 
    			      ["createdfrom","anyof",createdFrom], 
    			      "AND", 
    			      ["mainline","is","T"], 
    			      "AND", 
    			      ["item","anyof",itemName]
    			   ],
    			   columns:
    			   [
    			      search.createColumn({name: "tranid", label: "IF No"}),
    			     
    			   ]
    			});
    			var searchResultCount = itemfulfillmentSearchObj.runPaged().count;
    			log.debug("itemfulfillmentSearchObj result count",searchResultCount);
    			
    			var itemFullfillmentNumber = '';
    			itemfulfillmentSearchObj.run().each(function(result){
    				
    			var itemFullfillment = result.getValue('tranid');
    			log.debug("itemFullfillment",itemFullfillment);
    			itemFullfillmentNumber += itemFullfillment + '/';
    			
    			   // .run().each has a limit of 4,000 results
    			   return true;
    			});

    			/*
    			itemfulfillmentSearchObj.id="customsearch1683017034567";
    			itemfulfillmentSearchObj.title="Item fullfillment AD (copy)";
    			var newSearchId = itemfulfillmentSearchObj.save();
    			*/
    			  
//    			Set Item fulfillment number in IF field
        		for(var lineCount = 0;lineCount < item; lineCount++){
        			newRecord.setSublistValue({
        				sublistId: 'item',
        				fieldId: 'custcol_item_fullfillment_no_ad',
        				line: lineCount,
        				value: itemFullfillmentNumber.slice(0,-1) // Remove the last '/' character from the concatenated string
        			});
        		}
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
        beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };
    
});
