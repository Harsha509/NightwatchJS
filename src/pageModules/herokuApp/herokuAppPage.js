

var herokuAppLocatorsObj = require('../../pageLocators/herokuApp/herokuAppLocators.js');
var safeActionsObj = require('../../util/safeAction.js');

var fs = require("fs");
var sysdata = fs.readFileSync(".\\src\\testData\\sysData.json");
var sysData = JSON.parse(sysdata);

module.exports = {
    performClick : function (client) {
	safeActionsObj.safeClick(client,herokuAppLocatorsObj.dropdownLink,'drop down link',sysData.mediumWait);
    },

    verifyClick : function(client){
	safeActionsObj.safeVerifyElementPresent(client,herokuAppLocatorsObj.dropDownListLabel,'drop down label',sysData.mediumWait);
	safeActionsObj.safeAssertContainsText(client,herokuAppLocatorsObj.dropDownListLabel,"Dropdown List");
},

	verfiyItemToDrag: function(client){
		safeActionsObj.safeVerifyElementPresent(client,herokuAppLocatorsObj.elementToBeDragged,'"All Day" element to be dragged',sysData.mediumWait);
		client.pause(2000);
	},

	performDragAndDrop : function(client){
		safeActionsObj.safeDragAndDrop(client,herokuAppLocatorsObj.elementToBeDragged,herokuAppLocatorsObj.locationToBeDropped,'drag and drop',sysData.mediumWait);
		client.pause(2000);
	},

//switches to new window by clicking on multiple windows link
performSwitchToNewWindow : function(client){
    safeActionsObj.safeClick(client,herokuAppLocatorsObj.multipleWindowsLink,"multiple windows link",sysData.mediumWait);
    safeActionsObj.safeClick(client,herokuAppLocatorsObj.clickForNewWindow,"new window link",sysData.mediumWait);
    client.pause(1000);
    safeActionsObj.safeSwitchToWindow(client);
},

//Verifies new window by verifying the text in new window
verifySwitchToNewWindow : function(client) {
    client.pause(2000);
    safeActionsObj.safeAssertContainsText(client, herokuAppLocatorsObj.newWindowText, 'New Window');
    client.closeWindow();
},

	performSwitchToParentWindow : function(client) {
		safeActionsObj.safeSwitchToParentWindow(client);
	},
	verifySwitchToParentWindow : function(client){
		client.pause(2000);
		safeActionsObj.safeAssertContainsText(client,herokuAppLocatorsObj.clickForNewWindow,'Click Here');
	}

};