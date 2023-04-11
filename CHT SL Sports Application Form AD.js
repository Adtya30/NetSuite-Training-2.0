/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/runtime','N/ui/serverWidget','N/record','N/format'],

function(runtime,serverWidget,record,format) {
   
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
    		
    		var request = context.request;
    		var response = context.response;
    		
    		
    		if(request.method === 'GET'){
    			var form =  serverWidget.createForm({
    				title:'Sports Application Form'
    			});
    			
    			 var name = form.addField({
    	        		id : 'custpage_name',
    	        		type : serverWidget.FieldType.TEXT,
    	        		label : 'Name'
    	    	});
    			 name.isMandatory=true;
    			 
    	          var date = form.addField({
    	        		id : 'custpage_date',
    	        		type : serverWidget.FieldType.DATE,
    	        		label : 'Date '
    	    	});
    	          
    	          var playerGender = form.addField({
  	        		id : 'custpage_player_gender',
  	        		type : serverWidget.FieldType.SELECT,
  	        		label : 'Player Gender'
  	    	});
    	          
    	          playerGender.addSelectOption({
      	        	  value:1,
      	        	  text:'Male'
      	          });
    	          playerGender.addSelectOption({
      	        	  value:2,
      	        	  text:'Female'
      	          });
    	          playerGender.addSelectOption({
      	        	  value:3,
      	        	  text:'Others'
      	          });
    	          
    	          var phone = form.addField({
  	        		id : 'custpage_phone',
  	        		type : serverWidget.FieldType.PHONE,
  	        		label : 'Phone'
  	    	});
    	          var emailId = form.addField({
  	        		id : 'custpage_email_id',
  	        		type : serverWidget.FieldType.EMAIL,
  	        		label : 'Email-Id'
  	    	});
    	          
    	          var dateOfBirth = form.addField({
  	        		id : 'custpage_d_o_b',
  	        		type : serverWidget.FieldType.DATE,
  	        		label : 'Date Of Birth'
  	    	});
    	          var parentContactNumber = form.addField({
    	        		id : 'custpage_parent_contact_number',
    	        		type : serverWidget.FieldType.PHONE,
    	        		label : 'Parent Conatct Number'
    	    	});
    	          
    	          var selectSport = form.addField({
    	        		id : 'custpage_select_sports',
    	        		type : serverWidget.FieldType.SELECT,
    	        		label : 'Select Sports'
    	    	});
      	          selectSport.addSelectOption({
      	        	  value:1,
      	        	  text:'Cricket'
      	          });
      	          selectSport.addSelectOption({
      	        	  value:2,
      	        	  text:'Football'
      	          });
      	          selectSport.addSelectOption({
      	        	  value:3,
      	        	  text:'Badminton'
      	          });
      	          selectSport.addSelectOption({
      	        	  value:4,
      	        	  text:'Table Tennis'
      	          });
      	          selectSport.addSelectOption({
      	        	  value:5,
      	        	  text:'Hockey'
      	          });
      	          selectSport.addSelectOption({
      	        	  value:6,
      	        	  text:'Basket Ball'
      	          });
    	          
    	          var address = form.addField({
    	        		id : 'custpage_address',
    	        		type : serverWidget.FieldType.LONGTEXT,
    	        		label : 'Address'
    	    	});
    	          
    	          
    	          
    	          var cityZipCode = form.addField({
    	        		id : 'custpage_city_zip_code',
    	        		type : serverWidget.FieldType.TEXT,
    	        		label : 'City, Zip Code'
    	    	});
    	          
    	          var uploadImage = form.addField({
  					id : 'custpage_upload_image',
  					type : serverWidget.FieldType.IMAGE,
  					label : 'Upload Image'
  				});
    	          
    	         
    	          
    	          var submitButton=form.addSubmitButton({
    	        	    label : 'Submit'

    	        });
    	          
    	          context.response.writePage(form);
    	    		return true;
    		}
    		else{
    			log.debug('In Post function');
//    			After clicking on submit button we get the data 
    			
    			var response=context.response;
    			
    			var request = context.request;
    			var currentUser = runtime.getCurrentUser().id;
    			log.debug('currentUser:',currentUser);
    			
    			var name = request.parameters.custpage_name;
    			log.debug('name:',name);
    			
    			var date = request.parameters.custpage_date;
    			log.debug('date:',date);
    			
    			var playerGender = request.parameters.custpage_player_gender;
    			log.debug('playerGender:',playerGender);
    			
    			var phone = request.parameters.custpage_phone;
    			log.debug('phone:',phone);
    			
    			var emailId = request.parameters.custpage_email_id;
    			log.debug('emailId:',emailId);
    			
    			var dateOfBirth = request.parameters.custpage_d_o_b;
    			log.debug('dateOfBirth:',dateOfBirth);
    			
    			var parentContactNumber = request.parameters.custpage_parent_contact_number;
    			log.debug('parentContactNumber:',parentContactNumber);
    			
    			var selectSport = request.parameters.custpage_select_sports;
    			log.debug('selectSport:',selectSport);
    			
    			var address = request.parameters.custpage_address;
    			log.debug('address:',address);
    			
    			var cityZipCode = request.parameters.custpage_city_zip_code;
    			log.debug('cityZipCode:',cityZipCode);
    			
    			var uploadImage = request.parameters.custpage_upload_image;
    			log.debug('uploadImage:',uploadImage);
    			

    			
    			//Setting value in custom Record
    			
    			var customRecord = record.create({
    				type:'customrecord_sports_app_form',
    				isdynamic:true
    			});
    			
    			customRecord.setValue({
    				fieldId:'name',
    				value:name,
    				ignoreFieldChange:true
    			});
    			var formattedDateString = format.parse({
    	            value: date,
    	            type: format.Type.DATE
    	        });
    			
    			customRecord.setValue({
    				fieldId:'custrecord_date_',
    				value:formattedDateString,
    				ignoreFieldChange:true
    			});
    			customRecord.setValue({
    				fieldId:'custrecord_player_gender',
    				value:playerGender,
    				ignoreFieldChange:true
    			});
    			customRecord.setValue({
    				fieldId:'custrecord_player_contact_number',
    				value:phone,
    				ignoreFieldChange:true
    			});
    			customRecord.setValue({
    				fieldId:'custrecord_player_email_',
    				value:emailId,
    				ignoreFieldChange:true
    			});
    			
    			var dob = format.parse({
    	            value: dateOfBirth,
    	            type: format.Type.DATE
    	        });
    			
    			customRecord.setValue({
    				fieldId:'custrecord_date_of_birth_',
    				value:dob,
    				ignoreFieldChange:true
    			});
    			
    			
    			customRecord.setValue({
    				fieldId:'custrecord_parent_contact_number',
    				value:parentContactNumber,
    				ignoreFieldChange:true
    			});
    			customRecord.setValue({
    				fieldId:'custrecord_selet_sports',
    				value:selectSport,
    				ignoreFieldChange:true
    			});
    			customRecord.setValue({
    				fieldId:'custrecord_permanent_address_',
    				value:address,
    				ignoreFieldChange:true
    			});
    			customRecord.setValue({
    				fieldId:'custrecord_city_zip_code',
    				value:cityZipCode,
    				ignoreFieldChange:true
    			});
    			
    			var saveRecord= customRecord.save();
    			
    			
    			
    		context.response.write('<body>Form has been Saved Succesfully. </body>');
    		
    		}
    		
    	}catch(e){
    		log.error("Error in Sport Application Form :",e);
    		
    	}

    }

    return {
        onRequest: onRequest
    };
    
});
