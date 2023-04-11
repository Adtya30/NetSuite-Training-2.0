/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
define(['N/search'],

function(search) {
   
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
    		var openInvList = [];
    		
    		log.debug('Inside Restlet');
    		var response = '';
    		
    		var requestInfo = requestBody.customRecord;
    		log.debug('requestInfo',requestInfo);
    		
    		
    		if(requestInfo){
    			var customrecord_amazon_monthly_visitors_infSearchObj = search.create({
    			type: requestInfo,
    			   filters:
    			   [
    			   ],
    			   columns:
    			   [
    			      search.createColumn({
    			         name: "name",
    			         sort: search.Sort.ASC,
    			         label: "Name"
    			      }),
    			      search.createColumn({name: "id", label: "ID"}),
    			      search.createColumn({name: "scriptid", label: "Script ID"}),
    			      search.createColumn({name: "custrecord_visitors_name", label: "Visitors  Name"}),
    			      search.createColumn({name: "custrecord_purpose_of_visit", label: "Purpose of Visit"}),
    			      search.createColumn({name: "custrecord_visitors_email", label: "Visitors Email"}),
    			      search.createColumn({name: "custrecord_visitors_phone_number", label: "Visitors Phone Number"})
    			   ]
    			});
    		
    			var searchResultCount = customrecord_amazon_monthly_visitors_infSearchObj.runPaged().count;
    			log.debug("customrecord_amazon_monthly_visitors_infSearchObj result count",searchResultCount);
    			customrecord_amazon_monthly_visitors_infSearchObj.run().each(function(result){
    			   // .run().each has a limit of 4,000 results
    				//create a search result /store it in JSON format
    				var custID;
        			var scriptId;
        			var visitorName;
        			var purposeofVisit;
        			var visitorsEmail;
        			var visiotrsPhone;
        			custID = result.getValue('id');
    				log.debug('custID',custID);
    				
    				scriptId = result.getValue('scriptid');
    				log.debug('scriptId',scriptId);
    				
    				visitorName = result.getValue('custrecord_visitors_name');
    				log.debug('visitorName',visitorName);
    				
    				purposeofVisit = result.getValue('custrecord_purpose_of_visit');
    				log.debug('purposeofVisit',purposeofVisit);
    				
    				visitorsEmail = result.getValue('custrecord_visitors_email');
    				log.debug('visitorsEmail',visitorsEmail);
    				
    				visiotrsPhone = result.getValue('custrecord_visitors_phone_number');
    				log.debug('visiotrsPhone',visiotrsPhone);
    			
    				openInvList.push({
    					'custID':custID,
    					'scriptId':scriptId,
    					'visitorName':visitorName,
    					'purposeofVisit':purposeofVisit,
    					'visitorsEmail':visitorsEmail,
    					'visiotrsPhone':visiotrsPhone
    				});
    			   return true;
    			});
    			response = openInvList;
    			return response;
    			
    		}else{
    			response = 'Error: There is no request data found';
        		return response;
    		}
    		
    		
    	}catch(e){
    		log.error('Error in doPost Function:',e)
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
