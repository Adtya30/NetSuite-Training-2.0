/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget','N/search','N/redirect','N/email'],

function(serverWidget,search,redirect,email) {
   
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
    		log.debug('In onRequest Function ');
    		
    		var request = context.request;
			var response = context.response;
			
			if(context.request.method === 'GET'){
				log.debug('In Get Function');
				
			var tranNumber = request.parameters.tranNumber;
	    	log.debug('tranNumber:',tranNumber);	
				
				//Create Suitelet Form
				var form =  serverWidget.createForm({
					title:'Purchase Order'
				});
				
				var tranID = form.addField({
					id : 'custpage_po_transaction_id',
					type : serverWidget.FieldType.SELECT,
					label : 'Transaction Number',
					source:'purchaseorder'
				});
				if(tranNumber){
					tranID.defaultValue = tranNumber;
				}
				
				var poDetails = form.addSublist({
	 				id : 'custpage_item_sublist',
	 				type : serverWidget.SublistType.INLINEEDITOR,
	 				label : 'Purchase Order Details'
	 			});
				
				poDetails.addField({
					id:'custpage_item',
					type:serverWidget.FieldType.SELECT,
					label:'Item',
					source:'item'
				});
				poDetails.addField({
					id:'custpage_quantity',
					type:serverWidget.FieldType.INTEGER,
					label:'Quantity'
				});
				poDetails.addField({
					id:'custpage_amount',
					type:serverWidget.FieldType.CURRENCY,
					label:'Amount'
				});
				poDetails.addField({
					id:'custpage_email',
					type:serverWidget.FieldType.TEXT,
					label:'Email-Id'
				});
								
				
			
				var button = form.addSubmitButton({
				label:'Submit'
				});
			
			//Purchase Order Search
			if(tranNumber){
			var purchaseorderSearchObj = search.create({
				   type: "purchaseorder",
				   filters:
				   [
				      ["type","anyof","PurchOrd"], 
				      "AND", 
				      ["mainline","is","F"], 
				      "AND", 
				      ["taxline","is","F"], 
				      "AND",
				      ["internalid","anyof",tranNumber]
				   ],
				   columns:
				   [
				      search.createColumn({name: "item", label: "Item"}),
				      search.createColumn({name: "quantity", label: "Quantity"}),
				      search.createColumn({name: "amount", label: "Amount"}),
				      search.createColumn({name: "email", label: "Email"})
				   ]
				});
				var data_Array = [];
				var poItem;
				var poQuantity;
				var poAmount;
				var poEmail;
			
				var searchResultCount = purchaseorderSearchObj.runPaged().count;
				log.debug("purchaseorderSearchObj result count",searchResultCount);
				purchaseorderSearchObj.run().each(function(result){
					
				poItem = result.getValue('item');
				log.debug('poItem :',poItem);
				poQuantity = result.getValue('quantity');
				log.debug('poQuantity :',poQuantity);
				poAmount = result.getValue('amount');
				log.debug('poAmount :',poAmount);
				poEmail = result.getValue('email');
				log.debug('poEmail :',poEmail);
				
					
				   // .run().each has a limit of 4,000 results
				data_Array.push([poItem, poQuantity, poAmount, poEmail]);
				 return true;
				});

				/*
				purchaseorderSearchObj.id="customsearch1680711163610";
				purchaseorderSearchObj.title="CHT Purchase Order Saved Search AD (copy)";
				var newSearchId = purchaseorderSearchObj.save();
				*/
				
				if(poAmount){
					for(var data=0; data<searchResultCount; data++){
						var dataFile = data_Array[data];
						
						poDetails.setSublistValue({
							id:'custpage_item',
							line: data,
							value:dataFile[0]
						});
						poDetails.setSublistValue({
							id:'custpage_quantity',
							line: data,
							value:dataFile[1]
						});
						
						poDetails.setSublistValue({
							id:'custpage_amount',
							line: data,
							value:dataFile[2]
						});
						poDetails.setSublistValue({
							id:'custpage_email',
							line: data,
							value:dataFile[3]
						});
						
					}//for
				}//if
			}//if
//			form.clientScriptModulePath = 'SuiteScripts/CHT CS PO Transaction Number AD.js';
			context.response.writePage(form);	
			return true;
		}else{
				log.debug('In Post Function');
				var request = context.request;
				
				
				var tranNumber = request.parameters.custpage_po_transaction_id;
    			log.debug('tranNumber :',tranNumber);
    			
    			var sublistLineCount = request.getLineCount('custpage_item_sublist');
				log.debug('sublistLineCount',sublistLineCount);
				
				var item;
				var quantity;
				var amount;
				if (sublistLineCount > 0) {
    			
    			for(var lineCount = 0; lineCount < sublistLineCount; lineCount++){
    				
    				 item = request.getSublist({
    					sublistId: 'custpage_item_sublist',
    					fieldId: 'custpage_item',
    					line: lineCount
    				});
    				log.debug('item',item);
    				 quantity = request.getSublistValue({
    					sublistId: 'custpage_item_sublist',
    					fieldId: 'custpage_quantity',
    					line: lineCount
    				});
    				log.debug('quantity',quantity);
    				
    				 amount = request.getSublistValue({
    					sublistId: 'custpage_item_sublist',
    					fieldId: 'custpage_amount',
    					line: lineCount
    				});
    				log.debug('amount',amount);
    			}    			
    			
    			
    			var recipientId = 'customer@gmail.com';
    			var emailBody;
    			emailBody = "<head><style>table{width:100%;}, th, td {border: 1px solid black;}</style></head>";
    			emailBody += "<body><h2>Transaction Details</h2>";
    			emailBody += "<table><tr><th>Item</th><th>Quantity</th><th>Amount</th></tr>";
    			emailBody += "<tr><td>"+item+"</td><td>"+quantity+"</td><td>"+amount+"</td></tr>";
    			emailBody += "</table></body>";
				var Subject = "Purchase Order Details";					
   		
//    			Send Email
    			email.send({
					author:25659,
					recipients: recipientId,
					subject: Subject,
					body: emailBody
				});
    			
    			log.debug('Email Sent Successfully');
				}
				
				
//    			Redirect to same suitelet Page
    			redirect.toSuitelet({
					scriptId: 'customscript_cht_po_transaction_no_ad',
					deploymentId: 'customdeploy_cht_po_transaction_no_ad',
					parameters:{
						'tranNumber' :tranNumber
					}
				});
			}	
    	}catch(e){
    		log.error('Error in onrequest Function :',e);
    	}
    }

    return {
        onRequest: onRequest
    };
    
});