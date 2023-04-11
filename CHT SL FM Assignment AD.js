/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget','N/file','N/task'],

function(serverWidget,file,task) {
   
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
    		
    		if(context.request.method === 'GET'){
    			
//    			Create a suitelet Form
    			var form = serverWidget.createForm({
    			    title : 'Create Invoice from File'
    			});
    			
//    			Upload your csv File
    			var file = form.addField({
					id : 'custpage_file',
					type : serverWidget.FieldType.FILE,
					label : 'Upload File',
				});
    			
//    			Submit Button
    			var button = form.addSubmitButton({
    		        label: 'Submit'
    		      });

    		    context.response.writePage(form);   		    
    		    
    		}else if(context.request.method === 'POST'){
    		
    		var fileObj = context.request.files.custpage_file;
    		log.debug('fileObj',fileObj);
    		
    		//Get the file Contents
    		var file = fileObj.getContents();
    		log.debug('file',file);
    		
//    		Save the file to file Cabinet			
    		fileObj.folder = 13631;
    		var fileId = fileObj.save();
    		log.debug('File has been saved to file cabinet');
    		
    		
    		// Call the Map/Reduce script to create the invoice
  	      var mrTask = task.create({
  	        taskType: task.TaskType.MAP_REDUCE,
  	        scriptId: 'customscript_cht_mr_fm_assignment_ad',
  	        deploymentId: 'customdeploy_cht_mr_fm_assignment_ad',
  	        params: {
  	          'file_id': fileId
  	        }
  	      });
  	      mrTask.submit();
  	      
  	      context.response.writePage('<body>File has been succesfully Uploaded.<br> This Page will automatically closed in 5 sec.<script>setTimeout("window.close()",5000)</script></body>');
    			
    		}
	
    	}catch(e){
    		log.error('Error in onRequest Function :',e);
    	}

    }

    return {
        onRequest: onRequest
    };
    
});
