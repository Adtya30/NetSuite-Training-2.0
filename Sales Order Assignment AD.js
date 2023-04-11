/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/runtime','N/ui/serverWidget','N/record','N/url', 'N/redirect'],

function(runtime,serverWidget,record,url,redirect) {
   
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
    		var scriptParam = runtime.getCurrentScript();
			log.debug('Total Governance Units :'+scriptParam.getRemainingUsage());
			
    			var request = context.request;
    			var response = context.response;
    		
			
			if(request.method ==='GET'){
			log.debug('In GET function');
				
				//Create Suitelet Form
				var form =  serverWidget.createForm({
					title:'Sales Order'
				});
				
				var internalId = form.addField({
					id : 'custpage_so_internal_id',
					type : serverWidget.FieldType.TEXT,
					label : 'Sales Order Internal ID'
				});
				
				//Submit Button

				var submitButton=form.addSubmitButton({
					label : 'Submit'
				});
				
				//Client Script Path

				form.clientScriptModulePath ='SuiteScripts/CS Sales Order Assignment AD.js';
				context.response.writePage(form);
				return true;
				
			}else if(request.method ==='POST'){
				log.debug('In POST function');
//				Used to get data 
			
				var currentUser = runtime.getCurrentUser().id;
				log.debug('currentUser ID:',currentUser);
			
				var salesOrder = request.parameters.custpage_so_internal_id;
				log.debug('salesOrder ID:',salesOrder);
				
//				Redirect to Record
//				redirect.toRecord({
//				    type: record.Type.SALES_ORDER, 
//				    id: salesOrder,
//				});
				 	
			  
			}
			log.debug("Remaining Governance Units :"+scriptParam.getRemainingUsage());
    	}catch(e){
    		log.error('Error in onRequest Function :',e);
    	}
    }

    return {
        onRequest: onRequest
    };
    
});
