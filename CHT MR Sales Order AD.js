/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/search','N/record'],

function(search,record) {
   
    /**
     * Marks the beginning of the Map/Reduce process and generates input data.
     *
     * @typedef {Object} ObjectRef
     * @property {number} id - Internal ID of the record instance
     * @property {string} type - Record type id
     *
     * @return {Array|Object|Search|RecordRef} inputSummary
     * @since 2015.1
     */
    function getInputData() {
    	try{
    		log.debug('In getInputData','In getInputData');
    		
    		var openInvList = [];
    		var salesorderSearchObj = search.create({
    			   type: "salesorder",
    			   filters:
    			   [
    			      ["type","anyof","SalesOrd"], 
    			      "AND", 
    			      ["mainline","is","T"], 
    			      "AND", 
    			      ["name","anyof","13352"]
    			   ],
    			   columns:
    			   [
    			      search.createColumn({name: "internalid", label: "Internal ID"}),
    			      search.createColumn({name: "tranid", label: "Document Number"}),
    			      search.createColumn({name: "statusref", label: "Status"}),
    			      search.createColumn({name: "amount", label: "Amount"})
    			   ]
    			});
    			var searchResultCount = salesorderSearchObj.runPaged().count;
    			log.debug("salesorderSearchObj result count",searchResultCount);
    			var internalId;
    			var documentNumber;
    			var status;
    			var Amount;
    			salesorderSearchObj.run().each(function(result){
    			   // .run().each has a limit of 4,000 results
    				
    				internalId = result.getValue('internalid');
    				log.debug('internalId',internalId);
    				
    				documentNumber = result.getValue('tranid');
    				log.debug('documentNumber',documentNumber);
    				
    				status = result.getValue('statusref');
    				log.debug('status',status);
    				
    				Amount = result.getValue('amount');
    				log.debug('Amount',Amount);
    				
    				openInvList.push({
    					'internalId':internalId,
    					'documentNumber':documentNumber,
    					'status':status,
    					'Amount':Amount
    				});
    			   return true;
    			});
    			log.debug('openInvList',openInvList);
    			log.debug('End of getInputData');    
    			return openInvList;
    			/*
    			salesorderSearchObj.id="customsearch1680153898046";
    			salesorderSearchObj.title="Custom Search Sales Order AD (copy)";
    			var newSearchId = salesorderSearchObj.save();
    			*/
    		
    	}catch(e){
    		log.error('Error in getInput Function ',e);
    	}
    }

    /**
     * Executes when the map entry point is triggered and applies to each key/value pair.
     *
     * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
     * @since 2015.1
     */
    function map(context) {
    	try{
    		log.debug('In Map Stage','In Map Stage');
    		var invResults = JSON.parse(context.value);
    		log.debug('invResults',invResults);
    		
    		var m_internalId = invResults.internalId;
    		log.debug('m_internalId',m_internalId);
    		
			var m_documentNumber = invResults.documentNumber;
    		log.debug('m_documentNumber',m_documentNumber);
    		
			var m_status = invResults.status;
    		log.debug('m_status',m_status);
    		
			var m_amount = invResults.Amount;
    		log.debug('m_amount',m_amount);
    		
    		context.write({
    			key:m_internalId,
    			value:{
    				'm_internalId':m_internalId,
    				'm_documentNumber':m_documentNumber,
    				'm_status':m_status,
    				'm_amount':m_amount
    			}
    		});
    		
    	}catch(e){
    		log.error('Error in Map Function',e);
    		
    	}
    }

    /**
     * Executes when the reduce entry point is triggered and applies to each group.
     *
     * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
     * @since 2015.1
     */
    function reduce(context) {
    	try{
    		log.debug('In Reduce Stage');
    		log.debug('Key',context.key);
    		log.debug('value',context.values);
    		log.debug('value Length',context.values.length);
    		
    		var value = context.values;
    		var value_Length = context.values.length;
    		
    		for(var data = 1; data < value_Length; data++){
    			var invResults = JSON.parse(value[data]); 
    			log.debug('invResults data:',invResults);
    		
    		var r_internalId = currentRecord['m_internalId'];
    		log.debug('r_internalId', r_internalId);
    		
    		var r_documentNumber = currentRecord['m_documentNumber'];
    		log.debug('r_documentNumber', r_documentNumber);
    		
    		var r_status = currentRecord['m_status'];
    		log.debug('r_status', r_status);
    		
    		var r_amount = currentRecord['m_amount'];
    		log.debug('r_amount', r_amount);
    		
    		var invRecord = record.transform({
    			   fromType:record.Type.SALES_ORDER,
    			   fromId: internalid,
    			   toType:record.Type.INVOICE,
    			   });

    		log.debug('Record Transformed');
    		
    		
    		var invoiceId = invRecord.save();
			log.debug('Invoice created and Id is', invoiceId);
    		}
    	}catch(e){
    		log.error('Error in Reduce Function ',e);
    	}
    }


    /**
     * Executes when the summarize entry point is triggered and applies to the result set.
     *
     * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
     * @since 2015.1
     */
    function summarize(summary) {

    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
    
});