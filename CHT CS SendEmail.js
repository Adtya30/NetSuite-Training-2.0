/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/url'],

function(url) {
    
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

    
    function openCustomEmailPage() {
    	alert("Hello Aditya");
    
    var output = url.resolveScript({
    	scriptId:'customscript_cht_sl_send_email_ad',
    	deploymentId:'customdeploy_cht_sl_send_email_ad',
    	returnExternalUrl: false
    });	
    
    alert('Output :'+output);
    var accId=url.resolveDomain({
        hostType: url.HostType.APPLICATION
    });
    alert('Account ID :'+accId);
    
    var finalUrl ='https://'+accId+output
    
//    output='/app/site/hosting/scriptlet.nl?script=6371&deploy=1';
//    
//    var finalUrl='https://tstdrv1911674.app.netsuite.com/core/media/media.nl?id=93710&c=TSTDRV1911674&h=aFUFgAh3A_sHzHnspfUpaxzUT9Vj70eMmuzf2ePr7KV7WzbV&_xt=.js'+output;

    
    
    window.open(finalUrl);
    return true;
}
    
    return {
        pageInit: pageInit,
        openCustomEmailPage: openCustomEmailPage,
        
    };
    
});
