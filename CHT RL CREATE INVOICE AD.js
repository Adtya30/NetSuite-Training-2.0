/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
define(['N/record'],

function(record) {
   
    /**
     * Function called upon sending a GET request to the RESTlet.
     *
     * @param {Object} requestParams - Parameters from HTTP request URL; parameters will be passed into function as an Object (for all supported content types)
     * @returns {string | Object} HTTP response body; return string when request Content-Type is 'text/plain'; return Object when request Content-Type is 'application/json'
     * @since 2015.1
     */
    function doGet(requestParams) {

    }

    /**
     * Function called upon sending a PUT request to the RESTlet.
     *
     * @param {string | Object} requestBody - The HTTP request body; request body will be passed into function as a string when request Content-Type is 'text/plain'
     * or parsed into an Object when request Content-Type is 'application/json' (in which case the body must be a valid JSON)
     * @returns {string | Object} HTTP response body; return string when request Content-Type is 'text/plain'; return Object when request Content-Type is 'application/json'
     * @since 2015.2
     */
    function doPut(requestBody) {

    }


    /**
     * Function called upon sending a POST request to the RESTlet.
     *
     * @param {string | Object} requestBody - The HTTP request body; request body will be passed into function as a string when request Content-Type is 'text/plain'
     * or parsed into an Object when request Content-Type is 'application/json' (in which case the body must be a valid JSON)
     * @returns {string | Object} HTTP response body; return string when request Content-Type is 'text/plain'; return Object when request Content-Type is 'application/json'
     * @since 2015.2
     */
    function doPost(requestBody) {
    	
    	try{
    		log.debug('In doPost Function');
    		var response = '';
    		
    		var requestInfo = requestBody.customRecord;
    		log.debug('requestInfo',requestInfo);
    		
    		var customer = requestBody.customer;
    		log.debug('customer',customer);
    		
    		var item = requestBody.item;
    		log.debug('item',item);
    		
    		var quantity = requestBody.quantity;
    		log.debug('quantity',quantity);
    		
    		var rate = requestBody.rate;
    		log.debug('rate',rate);
    		
    		var location = requestBody.location;
    		log.debug('location',location);
    		
    		var taxCode = requestBody.taxCode;
    		log.debug('taxCode',taxCode);
    		
    		var Return = requestBody.Return;
			log.debug('Return', Return);
    		
    		if(requestInfo){
    			var invoiceRecord = record.create({
    				type: record.Type.INVOICE	
    			});
    			
    		invoiceRecord.setValue({
    			fieldId :'entity',
    			value : customer
    		});
    		log.debug('Customer selected');
    		
    		invoiceRecord.setSublistValue({
    			sublistId : 'item',
				fieldId : 'item',
				line : 0,
				value : item
			});
    		log.debug('Item selected');
    		
    		invoiceRecord.setSublistValue({
    			sublistId : 'item',
				fieldId : 'quantity',
				line : 0,
				value : quantity
			});
    		log.debug('Quantity selected');
    		
    		invoiceRecord.setSublistValue({
    			sublistId : 'item',
				fieldId : 'rate',
				line : 0,
				value : rate
			});
    		log.debug('Rate selected');
    		
    		invoiceRecord.setValue({
    			sublistId : 'item',
				fieldId : 'location',
				line : 0,
				value : location
			});
    		log.debug('Location selected');
    		
    		invoiceRecord.setSublistValue({
    			sublistId : 'item',
				fieldId : 'taxCode',
				line : 0,
				value : taxCode
			});
    		log.debug('TaxCode selected');
    		
    		invoiceRecord.setValue({
				sublistId : 'item',
				fieldId : 'custbody_eb_returnreason',
				line : 0,
				value : Return
			});
    		
    		var invSaved = invoiceRecord.save();
			log.debug('invSaved',invSaved);
			
			if(invSaved){
				response = 'INVOICE Created Succesfull, Id'+invSaved;
			}
				return response;
    	} else{
    			response = 'Error: There is no Request data found';
    			return response;   		
    		}
   	
    	}catch(e){
    		log.error('Error in doPost Function: ',e);
    		return e.message;
    	}
    
    }

    /**
     * Function called upon sending a DELETE request to the RESTlet.
     *
     * @param {Object} requestParams - Parameters from HTTP request URL; parameters will be passed into function as an Object (for all supported content types)
     * @returns {string | Object} HTTP response body; return string when request Content-Type is 'text/plain'; return Object when request Content-Type is 'application/json'
     * @since 2015.2
     */
    function doDelete(requestParams) {

    }

    return {
//        'get': doGet,
//        put: doPut,
        post: doPost,
//        'delete': doDelete
    };
    
});
