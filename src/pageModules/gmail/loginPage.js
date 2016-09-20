
var loginPagelocatorsObj = require('../../pageLocators/gmail/loginPageLocators.js');
var homePagelocatorsObj = require('../../pageLocators/gmail/homePageLocators.js');
var safeActionsObj = require('../../util/safeAction.js');

var fs = require("fs");
var sysdata = fs.readFileSync(".\\src\\testData\\sysData.json");
var sysData = JSON.parse(sysdata);

module.exports = {
    
    //Enter email, click on next button, enter password and click on Login button
    login : function (client,user,password) {
        safeActionsObj.safeType(client,loginPagelocatorsObj.ENTER_MAILID,user,"mail ID field in login page",sysData.shortWait);
        safeActionsObj.safeClick(client,loginPagelocatorsObj.CLCIKON_NEXT,"next button in login page",sysData.shortWait);
        safeActionsObj.safeType(client,loginPagelocatorsObj.ENTER_PASSWORD,password,"password field in login page",sysData.shortWait);
        safeActionsObj.safeClick(client,loginPagelocatorsObj.LOGIN_BTN,"login button in login page",sysData.shortWait);
    },

    //Verifies login by verifying the presence of compose button in home page
    verifyLogin : function(client,textInURL){
        safeActionsObj.safeVerifyElementPresent(client,homePagelocatorsObj.COMPOSE_BTN,"compose button in home page",sysData.longWait);
        safeActionsObj.safeUrlContains(client,textInURL);
    }
};