
var herokuAppPageObj = require('../pageModules/herokuApp/herokuAppPage.js');
var fs = require("fs");
var appdata = fs.readFileSync(".\\src\\testData\\appData.json");
var appData=JSON.parse(appdata);

module.exports = {

	'@disabled': false, // This will prevent the test module from running.
	before : function(client) {
		client
			.windowMaximize()
	},

	/*@pending - To disable test case to run
	E.g. 'Should perform window handling':'@pending'+ function(client){
	 * */
	'Should perform window handling':function(client){
		client.url(appData.theInternetPageUrl);
		herokuAppPageObj.performSwitchToNewWindow(client);
		herokuAppPageObj.verifySwitchToNewWindow(client);
		herokuAppPageObj.performSwitchToParentWindow(client);
		herokuAppPageObj.verifySwitchToParentWindow(client);
		client
			.end()
	},

	'Should perform drag and drop':function(client){
		client.url(appData.calenderUrl);
		herokuAppPageObj.verfiyItemToDrag(client);
		herokuAppPageObj.performDragAndDrop(client);
		client
			.end()
	}
};