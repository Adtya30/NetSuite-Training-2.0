/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/search','N/file','N/record'],

function(search,file,record) {
   
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
    		log.debug('In get Input Data');
    		var folderSearchObj = search.create({
    			   type: "folder",
    			   filters:
    			   [
    			      ["internalid","anyof","15043"]
    			   ],
    			   columns:
    			   [
    			      search.createColumn({
    			         name: "internalid",
    			         join: "file",
    			         label: "file Id"
    			      })
    			   ]
    			});
    			var aRray = [];
    			var fileId;
    			var fileName = '';
    			
    			var searchResultCount = folderSearchObj.runPaged().count;
    			log.debug("folderSearchObj result count",searchResultCount);
    			folderSearchObj.run().each(function(result){
    			 
    			fileId = result.getValue({
    				name: "internalid",
    				join: "file",
    				label: "file Id"
    			});
    			log.debug('fileId',fileId);
    			
    			fileName = result.getValue({
    				name:"name",
    				join:"file"
    			});
    			log.debug('fileName',fileName);
    			
    			if(fileId){
    				aRray.push({
    					'fileId':fileId,
    					'fileName':fileName,
    					
    				});
    			}
    				// .run().each has a limit of 4,000 results
    			   return true;
    			});
    			log.debug('aRray :',aRray);
    			return aRray;
    			log.debug('End of Get Input Data');
    			
    			/*
    			folderSearchObj.id="customsearch1681196799037";
    			folderSearchObj.title="Folder Search Aditya MR (copy)";
    			var newSearchId = folderSearchObj.save();
    			*/
	
    	}catch(e){
    		log.error('Error in getInput Data :',e);
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
    		log.debug('invResults :',invResults);
    		
    		var m_fileId = invResults.fileId;
    		log.debug('m_fileId',m_fileId);
    		
    		var fileObj = file.load({
    			id: m_fileId
    		});
    		// Read the contents of the file
    	
    		var fileContents;
    		if (fileObj.size < 10485760){
    			fileContents = fileObj.getContents();
    		    log.debug('fileContents',fileContents);
    		}
//    		converts CSV file it into 2D array using the split() method.
    		var csvData = fileContents.split(/\r?\n/).map(function (line) {
	  		      return line.split(',');
	  		    });	
    		var rows = csvData.slice(1);
    		
    		for(var i = 0; i < rows.length; i++){
    			var m_externalId = rows[i][0];
    			var m_customer = rows[i][1];
    			var m_item = rows[i][2];
    			var m_quantity = rows[i][3];
    			var m_rate = rows[i][4];
    			var m_amount = rows[i][5];
    			var m_location = rows[i][6];
    			var m_taxCode = rows[i][7];
    		
    		
    			context.write({
        			key : m_fileId,
        			value : {
        				'm_fileId':m_fileId,
    	  				'm_customer':m_customer,
    	  				'm_externalId':m_externalId,
    	  				'm_item':m_item,
    	  				'm_quantity':m_quantity,
    	  				'm_rate':m_rate,
    	  				'm_amount':m_amount,
    	  				'm_location':m_location,
    	  				'm_taxCode':m_taxCode
        			}
        		});
    		}
    		
    	}catch(e){
    		log.error('Error in Map :',e);
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
    		log.debug('In Reduce Stage', 'In Reduce Stage');
    		log.debug('Key:',context.key);
    		log.debug('value:',context.values);
    		log.debug('value Length:',context.values.length);
    		var value_Length = context.values.length;
    		
    		var r_fileId;
    		var r_customer;
    		var r_externalId;
    		var r_item;
    		var r_quantity;
    		var r_rate;
    		var r_amount;
    		var r_location;
    		var r_taxCode;
    		
    		var value = context.values;
    		for (data = 1; data <value_Length; data++){
    			var invResults = JSON.parse(value[data]);
        		log.debug('invResults :',invResults)
        		
        		r_fileId = invResults.m_fileId;
        		log.debug('r_fileId',r_fileId)
        		
        		r_customer = invResults.m_customer;
        		log.debug('r_customer',r_customer)
        		
        		r_externalId = invResults.m_externalId;
        		log.debug('r_externalId',r_externalId)
        		
        		r_item = invResults.m_item;
        		log.debug('r_item',r_item)
        		
        		r_quantity = invResults.m_quantity;
        		log.debug('r_quantity',r_quantity)
        		
        		r_rate = invResults.m_rate;
        		log.debug('r_rate',r_rate)
        		
        		r_amount = invResults.m_amount;
        		log.debug('r_amount',r_amount)
        		
        		r_location = invResults.m_location;
        		log.debug('r_location',r_location)
        		
        		r_taxCode = invResults.m_taxCode;
        		log.debug('r_taxCode',r_taxCode)
        		
        		var invRecord = record.create({
    				type : record.Type.INVOICE
    			});
        		
        		invRecord.setValue({
        			fieldId :'entity',
        			value : invResults.m_customer
        		});
        		log.debug('Customer selected');
        		
        		invRecord.setSublistValue({
    			    sublistId: 'item',
    			    fieldId: 'item',
    			    line: 0,
    			    value: invResults.m_item
    			});
    			log.debug('Item selected');
        		
        		invRecord.setSublistValue({
        			sublistId: 'item',
        			fieldId: 'quantity',
        			line : 0,
        			value : invResults.m_quantity
        		});
        		log.debug('Quantity selected');
        		
        		invRecord.setSublistValue({
        			sublistId: 'item',
        			fieldId: 'rate',
        			line : 0,
        			value : invResults.m_rate
        		});
        		log.debug('Rate selected');
        		
        		invRecord.setSublistValue({
        			sublistId: 'item',
        			fieldId: 'amount',
        			line : 0,
        			value : invResults.m_amount
        		});
        		log.debug('Amount selected');
        		
        		invRecord.setSublistValue({
        			sublistId: 'item',
        			fieldId: 'location',
        			line : 0,
        			value : invResults.m_location
        		});
        		log.debug('Location selected');
        		
        		invRecord.setSublistValue({
        			sublistId: 'item',
        			fieldId: 'taxcode',
        			line : 0,
        			value : invResults['m_taxcode']
        		});
        		log.debug('Tax Code selected');
        		
        		var invoiceId = invRecord.save();
    			log.debug('New Invoice should be created in System :', invoiceId);
    		}
    		
    	}catch(e){
    		log.error('Error in Reduce :',e);
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
    		log.error('Error in Summarize :',e);
    	}

    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
    
});