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
    		log.debug('In Post Function');
    		var response = '';
    		
    		var requestInfo = requestBody.customRecord;
    		log.debug('requestInfo',requestInfo);
    		
    		var custName = requestBody.customerName;
    		log.debug('custName',custName);
    		
    		var personName = requestBody.personName;
    		log.debug('personName',personName);
    		
    		var pickupAddress = requestBody.customerPickupAddress;
    		log.debug('pickupAddress',pickupAddress);
    		
    		var dropAddress = requestBody.customerDropAddress;
    		log.debug('dropAddress',dropAddress);
    		
    		var custEmail = requestBody.customerEmail;
    		log.debug('custEmail',custEmail);
    		
    		var custContactNumber = requestBody.customerContactNumber;
    		log.debug('custContactNumber',custContactNumber);
    		
    		
    		if(requestInfo){
    			
    			var recObj = record.create({
    				type: 'customrecord_ola_ride',
    			    isDynamic: true
    			});
    			recObj.setValue({
    				fieldId : 'name',
    				value : custName
    			});
    			
    			recObj.setValue({
    				fieldId : 'custrecord_starter',
    				value : personName
    			});
    			
    			recObj.setValue({
    				fieldId : 'custrecord_pickup_address',
    				value : pickupAddress
    			});
    			
    			recObj.setValue({
    				fieldId : 'custrecord_drop_address',
    				value : dropAddress
    			});
    			
    			recObj.setValue({
    				fieldId : 'custrecord_person_email_id',
    				value : custEmail
    			});
    			
    			recObj.setValue({
    				fieldId : 'custrecord_contact_number',
    				value : custContactNumber
    			});
    			
    			var recSaved = recObj.save();
    			log.debug('recSaved',recSaved);
    			
    			if(recSaved){
    				response = 'Custom Record Created Succesfull, Id #'+recSaved;
    			}else{
    				response = 'Custom Record Not Created';
    			}
    			return response;
    		}else{
    			response = 'Error: There is no Request data found';
    			return response;
    		}
    		
    	}catch(e){
    		log.error('Error in doPost Function :',e);
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
