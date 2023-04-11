/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/runtime','N/ui/serverWidget','N/email','N/file'],
		/**
		 * @param {runtime} runtime
		 */
		function(runtime,serverWidget,email,file) {

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
//			log.debug('Total Governance Units :'+scriptParam.getRemainingUsage());

			var request = context.request;
			var response = context.response;

			var form =  serverWidget.createForm({
				title:'Send Email'
			});

			if(request.method ==='GET'){

				var senderEmail = form.addField({
					id : 'custpage_sender_email',
					type : serverWidget.FieldType.EMAIL,
					label : 'From'
				});
				var receiverEmail = form.addField({
					id : 'custpage_receiver_email',
					type : serverWidget.FieldType.EMAIL,
					label : 'To'
				});
				var subject = form.addField({
					id : 'custpage_subject',
					type : serverWidget.FieldType.TEXT,
					label : 'Subject'
				});
				var date = form.addField({
					id : 'custpage_date',
					type : serverWidget.FieldType.DATE,
					label : 'Date '
				});

				var description = form.addField({
					id : 'custpage_compose_email',
					type : serverWidget.FieldType.LONGTEXT,
					label : 'Description'
				});

				var attachFile = form.addField({
					id : 'custpage_attach_file',
					type : serverWidget.FieldType.FILE,
					label : 'Attach File'
				});

				var submitButton=form.addSubmitButton({
					label : 'Submit'

				});

				context.response.writePage(form);
				return true;
			}else{
				log.debug('In Post function');
//				Used to get data 

				var request = context.request;
				var currentUser = runtime.getCurrentUser().id;
				log.debug('currentUser:',currentUser);

				var senderEmail = request.parameters.custpage_sender_email;
				log.debug('senderEmail:',senderEmail);

				var receiverEmail = request.parameters.custpage_receiver_email;
				log.debug('receiverEmail:',receiverEmail);

				var subject = request.parameters.custpage_subject;
				log.debug('subject:',subject);

				var date = request.parameters.custpage_date;
				log.debug('date:',date);

				var description = request.parameters.custpage_compose_email;
				log.debug('description:',description);

				var attachFile = request.files.custpage_attach_file;
				log.debug('attachFile:',attachFile);

//				file.folder = 13631;

//				// Save the file
//				var id = file.save();

				// Load the same file to ensure it was saved correctly
				var fileObj = file.load({
					id: 93744
				});



				email.send({
					author: currentUser,
					recipients: receiverEmail,
					subject: subject,
					body: description,
					attachments: [fileObj]

				});

				context.response.write('<body>Email has been sent succesfully. <script>setTimeout("window.close()",5000)</script></body>');
			}

			log.debug("Remaining Governance Units :"+scriptParam.getRemainingUsage());

		}catch(e){
			log.error("Error in onRequest :",e);
		}
	}

	return {
		onRequest: onRequest
	};

});