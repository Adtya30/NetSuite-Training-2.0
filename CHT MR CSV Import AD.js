/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/file','N/task'],

function(file,task) {
   
    /**
     * Marks the beginning of the Map/Reduce process and generates input data.
     *
     * @typedef {Object} ObjectRef
     * @property {number} id - Internal ID of the record instance
     * @property {string} type - Record type id
     *
     * @return {Array|Object|Search|RecordRef} inputSummary
     * @since 2015.1
     */
    function getInputData() {
    	try{
    		log.debug('In getInput Data');
    		
    		var csvData = [];
    		// Load the CSV file
    		var csvFile = file.load({
    			id : 106595
    		});
    		
    		// Read the contents of the file
    		var csvContent = csvFile.getContents();
    		
    		// Split the contents into rows
    		var csvRows = csvContent.split('\n');
    		var csvHeader = csvRows[0].split(',');
    		    		
    		for(var i=0;i<csvRows.length;i++){
    			var csvValues = csvRows[i].split(',');
    			var csvItem = {};
    		for(var j=0;j < csvHeader.length;j++){
    			csvItem[csvHeader[j]] = csvValues[j];
    		}	
    		csvData.push(csvItem);
    		}	
    		return csvData;		
    		
    	}catch(e){
    		log.error('Error in getInput Data :',e);
    	}
    }

    /**
     * Executes when the map entry point is triggered and applies to each key/value pair.
     *
     * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
     * @since 2015.1
     */
    function map(context) {
    	try{
    		log.debug('In Map Function');
    		var csvDATA = JSON.parse(context.value);
    		log.debug('csvDATA',csvDATA);
    		
    		var mrTask = task.create({
    	        taskType: task.TaskType.MAP_REDUCE,
    	        scriptId: 'customscript_cht_mr_csv_import_ad',
    	        deploymentId: 'customdeploy_cht_mr_csv_import_ad'
    	    });
    		
//    		var scriptTask = task.create({taskType: task.TaskType.CSV_IMPORT});
//    		scriptTask.mappingId = 51; 
//    		var f = file.load('SuiteScripts/custjoblist.csv');
//    		scriptTask.importFile = f;
//    		scriptTask.linkedFiles = {'addressbook': 'street,city\nval1,val2', 'purchases': file.load('SuiteScripts/other.csv')};
//    		var csvImportTaskId = scriptTask.submit();
    		
    	}catch(e){
    		log.error('Error in Map Function :',e);
    	}
    }

    /**
     * Executes when the reduce entry point is triggered and applies to each group.
     *
     * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
     * @since 2015.1
     */
    function reduce(context) {
    	try{
    		log.debug('In Reduce Function');
    		
    	}catch(e){
    		log.error('Error in Reduce Function :',e);
    	}
    }


    /**
     * Executes when the summarize entry point is triggered and applies to the result set.
     *
     * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
     * @since 2015.1
     */
    function summarize(summary) {
    	try{
    		log.debug('In Summarize Function');
    		
    	}catch(e){
    		log.error('Error in Summzrize Function :',e);
    	}
    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
    
});
