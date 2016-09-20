var homePagelocatorsObj = require('../../pageLocators/gmail/homePageLocators.js');
var loginPagelocatorsObj = require('../../pageLocators/gmail/loginPageLocators.js');
var safeActionsObj = require('../../util/safeAction.js');
var fs = require("fs");
var sysdata = fs.readFileSync(".\\src\\testData\\sysData.json");
var sysData = JSON.parse(sysdata);

module.exports= {

    composeMessage: function(client,user,subject,message) {
        safeActionsObj.safeClick(client,homePagelocatorsObj.COMPOSE_BTN,"Compose button in home pagew",sysData.mediumWait);
        safeActionsObj.safeType(client,homePagelocatorsObj.TO_EMAILID,user,"'to' mail id' field in compose email window",sysData.shortWait);
        safeActionsObj.safeType(client,homePagelocatorsObj.SUBJECT_FIELD,subject,"subject field in compose email window",sysData.shortWait);
        safeActionsObj.safeType(client,homePagelocatorsObj.BODY_FIELD,message,"mail body field in compose email window",sysData.shortWait);
        safeActionsObj.safeClick(client,homePagelocatorsObj.SEND_BTN,"send button in compose email window",sysData.shortWait);
    },
    verifySentMessage: function(client,message){
        safeActionsObj.safeVerifyElementPresent(client,homePagelocatorsObj.SENT_MSG,"mail sent message on the top in home page",sysData.shortWait);
        safeActionsObj.safeAssertElementVisible(client,homePagelocatorsObj.SENT_MSG);
        safeActionsObj.safeClick(client,homePagelocatorsObj.VIEW_MSG_LINK,"view message link in home page",sysData.shortWait);
        safeActionsObj.safeVerifyElementPresent(client,homePagelocatorsObj.SENTMAIL_BODY_MSG,"sent mail body message in sent modal",sysData.shortWait);
        safeActionsObj.safeAssertContainsText(client,homePagelocatorsObj.SENTMAIL_BODY_MSG,message);
    },

    logout: function(client){
        safeActionsObj.safeClick(client,homePagelocatorsObj.ACCOUNT_DROPDOWN,"account drop down in top right of home page",sysData.shortWait);
        safeActionsObj.safeClick(client,homePagelocatorsObj.LOGOUT_LINK,"logout link under account window",sysData.shortWait);
        safeActionsObj.safeAcceptAlert(client);
        safeActionsObj.safeVerifyElementPresent(client,loginPagelocatorsObj.LOGIN_BTN,"login button in login page",sysData.shortWait)
    }
};