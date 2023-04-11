/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record'],

function(record) {
    
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(scriptContext) {
    	
    }
    	function saveRecord(scriptContext){
    		var salesOrder = scriptContext.currentRecord.getValue({
    			fieldId: 'custpage_so_internal_id',
    			ignoreFieldChange: true
    		});

    		var validation = /[0-9]/;

    		if(salesOrder.match(validation) || validation==null || validation=="" ){
    			window.open('https://tstdrv1911674.app.netsuite.com/app/accounting/transactions/salesord.nl?id='+salesOrder+'&whence=');
    			scriptContext.currentRecord.setValue({
    				fieldId: 'custpage_so_internal_id',
    				value : '',
    				ignoreFieldChange: true
    			});
    		}
    		else {
    			alert("Enter Only Integer Value");
    		}

//    		/^[0-9]+$/
    	}

    return {
        pageInit: pageInit,
        saveRecord: saveRecord
//        validateLine: validateLine,
//        validateInsert: validateInsert,
//        validateDelete: validateDelete,

    };
    
});