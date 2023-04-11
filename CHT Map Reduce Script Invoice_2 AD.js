/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/search','N/file','N/record', 'N/runtime',],

function(search,file,record,runtime) {
   
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
    		log.debug('In getInput Data');
    		var folderSearchObj = search.create({
    			   type: "folder",
    			   filters:
    			   [
    			      ["internalid","anyof","13712"]
    			   ],
    			   columns:
    			   [
    			      search.createColumn({
    			         name: "internalid",
    			         join: "file",
    			         label: "File Id"
    			      })
    			   ]
    			});
    			var fileId = '';
    			
    			var searchResultCount = folderSearchObj.runPaged().count;
    			log.debug("folderSearchObj result count",searchResultCount);
    			folderSearchObj.run().each(function(result){
    				
    			fileId = result.getValue({name: "internalid", join: "file",label: "File Id"})

    			 return true;
    			});
               var File_Id={'fileId':fileId};
               log.debug('File_Id',File_Id);
   			   log.debug('End of getInputData');  
               return File_Id;
    			
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
	      	log.debug('In Map Stage','In Map Stage');
	  		var m_fileId = JSON.parse(context.value);
	  		log.debug('m_fileId:',m_fileId);


	  		var fileObj = file.load({
	  		    id: m_fileId
	  		});
	  		var fileContents;
	  		if (fileObj.size < 10485760){
	  		fileContents=  fileObj.getContents();
	  		log.debug('fileContents',fileContents);
	  		    }
 		
	  		log.debug('Value_length',context.value.length);
	  		 var csvData = fileContents.split(/\r?\n/).map(function (line) {
	  		      return line.split(',');
	  		    });

	  		 
	  		  var rows = csvData.slice(1); 
	  	    for (var i = 0; i < rows.length; i++) {
	  	      var m_externalId = rows[i][0];
	  	      var m_customer = rows[i][1];
	  	      var m_item = rows[i][2];
	  	      var m_quantity = rows[i][3];
	  	      var m_rate = rows[i][4];
	  	      var m_location = rows[i][5];
	  	      var m_taxCode = rows[i][6];
	  	      context.write({
    	  			key :m_fileId+'$'+m_externalId,
    	  			value :{
    	  				'm_fileId':m_fileId,
    	  				'm_customer':m_customer,
    	  				'm_externalId':m_externalId,
    	  				'm_item':m_item,
    	  				'm_quantity':m_quantity,
    	  				'm_rate':m_rate,
    	  				'm_location':m_location,
    	  				'm_taxCode':m_taxCode
    	  				
    	  			}
    	  		});
	  			
	  		}  		

	  	}catch(e){
	  		log.error('Error in map',e);
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
    		var value = context.values;
    		var value_Length=context.values.length;
    		log.debug("In reduce Stage");
    		log.debug('In Reduce Stage');
    		log.debug('Key:',context.key);
    		log.debug('value:',context.values);
    		log.debug('value_Length:',context.values.length);
    		
    		var key=context.key;
    		var redKeySplit = key.split('$');
    		var fileId=redKeySplit[1];
    		var externalId=redKeySplit[0];
    		
    		var errorFound = 0;
			var errorMessage = '';
			var errorData = '';
    		
    		var r_fileId;
    		var r_customer;
    		var r_externalId;
    		var r_item;
    		var r_quantity;
    		var r_rate;
    		var r_amount;
    		var r_location;
    		var r_taxCode;
    		
    		var invRecord = record.create({
				type : record.Type.INVOICE
			});
    		
    		for(cA = 0; cA < value_Length; cA++){

    			var invResults = JSON.parse(value[cA]);
    			log.debug('invResults cA:',invResults);

    			r_fileId = invResults.m_fileId;
    			log.debug("r_fileId", r_fileId);
    			
    			r_customer = invResults.m_customer;
    			log.debug("r_customer", r_customer);
    			
    			r_externalId = invResults.m_externalId;
    			log.debug("r_externalId", r_externalId);
    			
    			r_item = invResults.m_item;
    			log.debug("r_item", r_item);
    			
    			r_quantity = invResults.m_quantity;
    			log.debug("r_quantity", r_quantity);
    			
    			r_rate = invResults.m_rate;
    			log.debug("r_rate", r_rate);
    			
    			r_amount = invResults.m_amount;
    			log.debug("r_amount", r_amount);
    			
    			r_location = invResults.m_location;
    			log.debug("r_location", r_location);
    			
    			r_taxCode = invResults.m_taxCode;
    			log.debug("r_taxCode", r_taxCode);
    			

    			var inventoryitemSearchObj = search.create({
    				   type: "inventoryitem",
    				   filters:
    				   [
    				      ["internalid","anyof",r_item], 
    				      "AND", 
    				      ["type","anyof","InvtPart"]
    				   ],
    				   columns:
    				   [
    				      search.createColumn({
    				         name: "itemid",
    				         sort: search.Sort.ASC,
    				         label: "Name"
    				      }),
    				      search.createColumn({name: "internalid", label: "Internal ID"})
    				   ]
    				});
    			    itemName='';
    				var searchResultCount = inventoryitemSearchObj.runPaged().count;
    				log.debug("inventoryitemSearchObj result count",searchResultCount);
    				inventoryitemSearchObj.run().each(function(result){
    					itemName=result.getValue('internalid');
    					
    				   // .run().each has a limit of 4,000 results
    				   return true;
    				});

    				/*
    				inventoryitemSearchObj.id="customsearch1679416776880";
    				inventoryitemSearchObj.title="CHT Item S SV (copy)";
    				var newSearchId = inventoryitemSearchObj.save();
    				*/
    		if(itemName) {
    				  
    			invRecord.setValue({
    	    				fieldId : 'entity',
    	    				value : r_customer
    	    			});
    	    	log.debug('Customer selected');
    	    			
    			
    			invRecord.setSublistValue({
    			    sublistId: 'item',
    			    fieldId: 'item',
    			    line: cA,
    			    value: r_item,
    			});
    			log.debug('Item selected');
    			
    			invRecord.setSublistValue({
    			    sublistId: 'item',
    			    fieldId: 'quantity',
    			    line: cA,
    			    value:r_quantity
    			});
    			log.debug('Quantity described');
    			
    			invRecord.setSublistValue({
    			    sublistId: 'item',
    			    fieldId: 'rate',
    			    line: cA,
    			    value: r_rate
    			});
    			log.debug('Rate described');
    			
    			invRecord.setSublistValue({
    			    sublistId: 'item',
    			    fieldId: 'amount',
    			    line: cA,
    			    value: r_amount
    			});
    			log.debug('Amount calculated');
    			
    			invRecord.setSublistValue({
    			    sublistId: 'item',
    			    fieldId: 'location',
    			    line: cA,
    			    value: r_location
    			});
    			log.debug('Location filled');
    			
    			invRecord.setSublistValue({
    			    sublistId: 'item',
    			    fieldId: 'taxcode',
    			    line: cA,
    			    value: invResults['m_taxCode']
    			});
    			log.debug('Tax code selected');
    			
    		}else {
    			errorFound = 1;
				errorMessage = "Item not found in system" + r_item;
				errorData = invResults + r_externalId + r_item
						+ r_quantity + r_rate + errorMessage;
    		}

    	}
    		if(errorFound==1){
				context.write({
					key : '',
					value:{
						'errorData':errorData
					}
				
				});
			}
    		else if(errorFound==0){
    		
    		var invoiceId = invRecord.save();
			log.debug('Invoice created and Id is', invoiceId);
    		  }
    		
    	}catch(e){
    		log.error("Error In Reduce Stage",e)
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
//        summarize: summarize
    };
    
});
