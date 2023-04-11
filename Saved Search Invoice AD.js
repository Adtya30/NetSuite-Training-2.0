/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/search','N/file'],

function(search,file) {
   
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
    		var openInvList = [];
    		log.debug('In getInputData','In getInputData');
    		var folderSearchObj = search.create({
    		 type: "invoice",
    		   filters:
    		   [
    		      ["type","anyof","CustInvc"], 
    		      "AND", 
    		      ["name","anyof","25806"], 
    		      "AND", 
    		      ["status","anyof","CustInvc:A"], 
    		      "AND", 
    		      ["mainline","is","F"], 
    		      "AND", 
    		      ["taxline","is","F"], 
    		      "AND", 
    		      ["cogs","is","F"]
    		   ],
    		   columns:
    		   [
    		      search.createColumn({name: "tranid", label: "Document Number"}),
    		      search.createColumn({name: "entity", label: "Name"}),
    		      search.createColumn({name: "email", label: "Email"}),
    		      search.createColumn({name: "amount", label: "Amount"}),
    		      search.createColumn({name: "amountpaid", label: "Amount Paid"})
    		   ]
    		});
    		var searchResultCount = folderSearchObj.runPaged().count;
    		log.debug("folderSearchObj result count",searchResultCount);
    		var custName;
			var tranId;
			var invAmount;
			var amountPaid;
			var custEmail;
			folderSearchObj.run().each(function(result){
    		   // .run().each has a limit of 4,000 results
    			custName = result.getValue('entity');
				log.debug('custName',custName);
    			
    			tranId = result.getValue('tranid');
				log.debug('tranId',tranId);
				
				invAmount = result.getValue('amount');
				log.debug('invAmount',invAmount);
				
				amountPaid = result.getValue('amountpaid');
				log.debug('amountPaid',amountPaid);
				
				custEmail = result.getValue('email');
				log.debug('custEmail',custEmail);
				
				openInvList.push({
					'custName':custName,
					'tranId':tranId,
					'invAmount':invAmount,
					'amountPaid' : amountPaid,
					'custEmail':custEmail
				});
				
    		   return true;
    		});
			log.debug('openInvList',openInvList);
			log.debug('End of getInputData');     			
			return openInvList;
    		
    	}catch(e){
    		log.error('Error in getInputData',e);
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
    		log.debug('In Map Stage','In Map Stage')
    		var invResults = JSON.parse(context.value);
    		log.debug('invResults',invResults);
    		
    		var m_custName = invResults.custName;
    		log.debug('m_custName',m_custName);
			var m_tranId = invResults.tranId;
			log.debug('m_tranId',m_tranId);
			var m_invAmount = invResults.invAmount;
			log.debug('m_invAmount',m_invAmount);
			var m_amountPaid = invResults.amountPaid;
			log.debug('m_amountPaid', m_amountPaid);
			var m_custEmail = invResults.custEmail;
			log.debug('m_custEmail',m_custEmail);
			
	
			context.write({
				key:'AD',
				value:{
					'm_custName':m_custName,
					'm_tranId':m_tranId,
					'm_invAmount':m_invAmount,
					'm_amountPaid' : m_amountPaid,
					'm_custEmail':m_custEmail			
					
				}
			});
    	}catch(e){
    		log.error('Error in Map Stage',e);
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
    		
   
    		  var values = context.values;
    		  var value_Length = context.values.length;

    		  
    		  var csv = "";
    		  csv = "Customer Name,Transaction ID,Invoice Amount,Amount Paid,Customer Email\n";
    		 
    		  
			  //Create CSV File
	    	  var csvFile = file.create({
					name : 'SAVED SEARCH INVOICE.csv',
					contents : csv,
					folder : 13631,
					fileType : 'CSV'
				});
			    
	    	  
    		  //Extracts value from field and assigns it to a variable
    		  for (var record = 0; record < value_Length; record++) {
    			  
    			  var currentRecord = JSON.parse(values[record]);
    			  log.debug('currentRecord record:', currentRecord);
    			  
    			  
    			  var r_custName = currentRecord.m_custName;			          
			        log.debug('r_custName:',r_custName);
			        
			      var r_custTranid = currentRecord.m_tranId;			          
			        log.debug('r_custTranid:',r_custTranid);
			        
			      var r_invAmount = currentRecord.m_invAmount;
			        log.debug('r_invAmount:',r_invAmount);
			        
			      var r_invAmountPaid = currentRecord.m_amountPaid;
			        log.debug('r_invAmountPaid:',r_invAmountPaid);
			        
			      var r_custEmail = currentRecord.m_custEmail;
			        log.debug('r_custEmail:',r_custEmail);
			        
			      
			        //String Concatenation
			        var line =  r_custName + ',' + r_custTranid + ',' + r_invAmount + ',' + r_invAmountPaid + ',' + r_custEmail;
			        csvFile.appendLine({
			          value: line
			        });
			      }
 
			     // Save the file
			     var csvFileId = csvFile.save();
				 log.debug("SAVED SEARCH INVOICE CEATED SUCCESSFULLY");
	
				 
    	}catch(e){
    		log.error('Error in Reduce Stage',e);
    	}
    }


    /**
     * Executes when the summarize entry point is triggered and applies to the result set.
     *
     * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
     * @since 2015.1
     */
    function summarize(summary) {
    	try{
    		
    	}catch(e){
    		log.error('Error in summarize Stage',e);
    	}
    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
    
});
