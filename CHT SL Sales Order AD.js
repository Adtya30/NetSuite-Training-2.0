/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/search','N/ui/serverWidget','N/record'],

function(search,serverWidget,record) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
    	try{
    		log.debug('In onRequest Function');
    		
    		
    		var request = context.request;
    		var response = context.response;
    		
    		if(request.method ==='GET'){
    			log.debug('In GET function');
		
//    		Create SuiteLet Invoice Form
    		var form = serverWidget.createForm({
    			    title : 'Invoice'
    		});	
    		
//			Adding Sublist : List inside a list		
    		var invoice = form.addSublist({
			    id: 'custpage_invoice',
			    type: serverWidget.SublistType.INLINEEDITOR,
			    label: 'Invoice Details '
			 });
    		
    		invoice.addField({
			    id: 'custpage_internal_id',
			    type: serverWidget.FieldType.TEXT,
			    label: 'Internal ID'
			 });
    		invoice.addField({
			    id: 'custpage_documnet_no',
			    type: serverWidget.FieldType.TEXT,
			    label: 'Document Number'
			 });
    		
    		invoice.addField({
			    id: 'custpage_status',
			    type: serverWidget.FieldType.TEXT,
			    label: 'Status'
			 });
    		
    		invoice.addField({
			    id: 'custpage_amount',
			    type: serverWidget.FieldType.TEXT,
			    label: 'Amount'
			 });		
    		
//			Sales Order Search
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
    			   // .run().each has a limit of 4,000 results
    			
    			var internalId;
    			var documentNumber;
    			var status;
    			var Amount;
    			
    			var data_Array = [];
    			salesorderSearchObj.run().each(function(result){
    						
//    				Get field Value	and display field value in execution log
    				internalId = result.getValue('internalid');
    				log.debug('internalId',internalId);
    				
    				documentNumber = result.getValue('tranid');
    				log.debug('documentNumber',documentNumber);
    				
    				status = result.getValue('statusref');
    				log.debug('status',status);
    				
    				Amount = result.getValue('amount');
    				log.debug('Amount',Amount);
    				
    				data_Array.push([internalId, documentNumber, status, Amount]);
    				return true;
    			});

    		
    		
    		if(internalId){
    			
    			
    			for(var data = 0; data < searchResultCount;data++ ){
    				var dataFile = data_Array[data];
    			
    				
    				invoice.setSublistValue({
    					id:'custpage_internal_id',
    					line: data,
    					value:dataFile[0]				
    				});
    				invoice.setSublistValue({
    					id:'custpage_documnet_no',
    					line: data,
    					value:dataFile[1]				
    				});
    				invoice.setSublistValue({
    					id:'custpage_status',
    					line: data,
    					value:dataFile[2]				
    				});
    				invoice.setSublistValue({
    					id:'custpage_amount',
    					line: data,
    					value:dataFile[3]				
    				});
    			}  //for
		 
    		}  //if
    		context.response.writePage(form);
			return true;
    		
    		}   //get 
    		
    	
    		
    		
    	}catch(e){
    		log.error('Error in onRequest Function :',e);
    	}

    }

    return {
        onRequest: onRequest
    };
    
});