
var gmailLoginPageObj = require('../pageModules/gmail/loginPage');
var gmailHomePageObj = require('../pageModules/gmail/homePage');
//to read content of json files
var fs = require("fs");
var appdata = fs.readFileSync(".\\src\\testData\\appData.json");
var appData=JSON.parse(appdata);

module.exports = {

    '@disabled': false, // This will prevent the test module from running.
    before : function(client) {
        client
            .windowMaximize()
    },

    'Should login and verify gmail application' : function (client) {
        client.url(appData.gmailURL);
        gmailLoginPageObj.login(client,appData.gmailUser,appData.gmailPassword);
        gmailLoginPageObj.verifyLogin(client,appData.textInURL);
    },

    'Should compose, verify message and logout of gmail application' : function (client) {
        gmailHomePageObj.composeMessage(client,appData.gmailUser,appData.emailSubject,appData.emailBodyMessage);
        gmailHomePageObj.verifySentMessage(client,appData.emailBodyMessage);
        //gmailHomePageObj.verifySentMessage(client,appData.emailBodyMessage_Failure); /*Uncomment this method and comment above method to fail the test case */
        gmailHomePageObj.logout(client);
        client.end();
    }
};