/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget','N/record','N/search','N/redirect'],

function(serverWidget,record,search,redirect) {
   
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
    			
    		var customerName = request.parameters.customerName;
    		log.debug('customerName:',customerName);
    		
//    			Create SuiteLet Customer Form
    			var form = serverWidget.createForm({
                    title: 'Select Customer'
                 });
    			
    			var customerField = form.addField({
    			    id: 'custpage_customer',
    			    type: serverWidget.FieldType.SELECT,
    			    label: 'Customer Name',
    			    source:'CUSTOMER'
    			 });
    			if(customerName){
    				customerField.defaultValue = customerName;
				}
    			 
//    			Adding List inside a list
    			 var customerAddress = form.addSublist({
 					id : 'custpage_customer_address',
 					type : serverWidget.SublistType.INLINEEDITOR,
 					label : 'Address'
 				});
    			 customerAddress.addField({
   					id : 'custpage_customer_address',
   					type : serverWidget.FieldType.TEXT,
   					label : 'Address'
   				});
    			 customerAddress.addField({
    					id : 'custpage_customer_address1',
    					type : serverWidget.FieldType.TEXT,
    					label : 'Address 1'
    				});
    			 customerAddress.addField({
    					id : 'custpage_customer_address2',
    					type : serverWidget.FieldType.TEXT,
    					label : 'Address 2'
    				});
    			     			 
    			 customerAddress.addField({
  					id : 'custpage_customer_country',
  					type : serverWidget.FieldType.TEXT,
  					label : 'Country'
  				});
    			 customerAddress.addField({
   					id : 'custpage_customer_city',
   					type : serverWidget.FieldType.TEXT,
   					label : 'City'
   				});
    			 
    			 customerAddress.addField({
  					id : 'custpage_customer_zip_code',
  					type : serverWidget.FieldType.TEXT,
  					label : 'Zip Code'
  				});
    			
    			 customerAddress.addField({
    					id : 'custpage_shipping_add',
    					type : serverWidget.FieldType.CHECKBOX,
    					label : 'Shipping Address'
    					
    				});
    			 customerAddress.addField({
   					id : 'custpage_billing_add',
   					type : serverWidget.FieldType.CHECKBOX,
   					label : 'Billing Address'
   				});	
    		  			
    			 var button = form.addSubmitButton({
	 					label:'Search'
	 				});
    			if(customerName) {
//    				Customer Search
    				var customerSearchObj = search.create({
    					   type: "customer",
    					   filters:
    					   [
    					      ["internalid","anyof",customerName]
    					   ],
    					   columns:
    					   [
    					      search.createColumn({
    					         name: "entityid",
    					         sort: search.Sort.ASC,
    					         label: "Name"
    					      }),
    					      search.createColumn({name: "address", label: "Address"}),
    					      search.createColumn({name: "address1", label: "Address 1"}),
    					      search.createColumn({name: "address2", label: "Address 2"}),
    					      search.createColumn({name: "country", label: "Country"}),
    					      search.createColumn({name: "city", label: "City"}),
    					      search.createColumn({name: "zipcode", label: "Zip Code"}),
    					      search.createColumn({name: "isdefaultbilling", label: "Default Billing Address"}),
    					      search.createColumn({name: "isdefaultshipping", label: "Default Shipping Address"})
    					   ]
    					});
    				
    					var custAddress = '';
    					var custAddress1 = '';
    					var custAddress2 = '';
    					var custCountry = '';
    					var custCity = '';
    					var custZipCode ='';
    					var custShipping = '';
    					var custBilling = '';
    				
    					var searchResultCount = customerSearchObj.runPaged().count;
    					log.debug("customerSearchObj result count",searchResultCount);
    					customerSearchObj.run().each(function(result){
    					  
//    					Get field Value	and display field value in execution log
    					custAddress = result.getValue('address');
    					log.debug('custAddress :',custAddress);
    					custAddress1 = result.getValue('address1');
    					log.debug('custAddress1 :',custAddress1);
    					custAddress2 = result.getValue('address2');
    					log.debug('custAddress2 :',custAddress2);
    					custCountry = result.getValue('country');
    					log.debug('custCountry :',custCountry);
    					custCity = result.getValue('city');
    					log.debug('custCity :',custCity);
    					custZipCode = result.getValue('zipcode');
    					log.debug('custZipCode :',custZipCode);
    					custShipping = result.getValue('defaultbilling');	
    					log.debug('custShipping :',custShipping);
    					custBilling = result.getValue('defaultshipping');
    					log.debug('custBilling :',custBilling);
    				
   					    return true;
    					});

    					/*
    					customerSearchObj.id="customsearch1680029548934";
    					customerSearchObj.title="Customer Search SL AD (copy)";
    					var newSearchId = customerSearchObj.save();
    					*/
    					if(custShipping == true|| custBilling == false){
							custShipping = 'T'
								custBilling = ''
						}
						else if(custShipping == false|| custBilling==true){
							custShipping=''
							custBilling='T'
							return true;
						}
						
    					if(custAddress ){
    						
    						for( i=0; i < searchResultCount; i++){ 						
    							
    						customerAddress.setSublistValue({
    							id:'custpage_customer_address',
    							line: i,
    							value:custAddress
    						});
    						customerAddress.setSublistValue({
    							id:'custpage_customer_address1',
    							line:i,
    							value:custAddress1
    						});
    						customerAddress.setSublistValue({
    							id:'custpage_customer_address2',
    							line:i,
    							value:custAddress2
    						});
    						customerAddress.setSublistValue({
    							id:'custpage_customer_country',
    							line: i,
    							value:custCountry
    						});
    						customerAddress.setSublistValue({
    							id:'custpage_customer_city',
    							line: i,
    							value:custCity
    						});
    						customerAddress.setSublistValue({
    							id:'custpage_customer_zip_code',
    							line: i,
    							value:custZipCode
    						});
    						customerAddress.setSublistValue({
    							id:'custpage_shipping_add',
    							line: i,
    							value:custShipping
    						});
    						customerAddress.setSublistValue({
    							id:'custpage_billing_add',
    							line: i,
    							value:custBilling
    						});
    						}
    						
    					}
    			}
//    					Client Script File Path
    					form.clientScriptModulePath ='./CS Customer Record Assignment AD.js';
    					
    					context.response.writePage(form);
    					return true;
    				}else{
    						log.debug('In POST function');
    						var request = context.request;
    						
    						var customerName = request.parameters.custpage_customer;
    		    			log.debug('customerName :',customerName);
    		    			
//    		    			Redirect to same suitelet Page
    		    			redirect.toSuitelet({
    							scriptId: 'customscript_sl_customer_record_ad',
    							deploymentId: 'customdeploy_sl_customer_record_ad',
    							parameters:{
    								'customerName' :customerName
    								}
    						});
    					}
    	}
    	catch(e){
    		log.error('Error in onRequest Function :',e);
    	}
    }

    return {
        onRequest: onRequest
    };
    
});