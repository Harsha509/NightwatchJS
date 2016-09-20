
var log4js = require('log4js');
log4js.configure({
    appenders: [
        { type: 'console' },
        { type: 'file', filename: 'logs/logFile.log', category: 'log' }
    ]
});
var logger = log4js.getLogger('log');
var fs=require('fs');

module.exports = {

    /**
     * Function - Safe Function that waits for element to be present, waits until the element is loaded, then verifies element presence
     * @param identifier - locator of element to be found
     * @param friendlyname - description of the element to be found
     * @param timeout - time in milli seconds to wait until returning a failure
     */
    safeVerifyElementPresent : function(client,identifier,friendlyname,timeout){
       timeout = typeof timeout !== 'undefined' ? timeout : 40000
       this.verifyLocator(client,identifier);
       client
           .waitForElementPresent(identifier,timeout,function(result){
               if(result.status!==0) {
                   logger.info(result.status);
                   logger.error("Unable to find element - " + friendlyname+ " in time - "+timeout/1000+" Seconds");
               }
               else
                   logger.info(friendlyname+" - was found")
           })
    },

    /**
     * Function - Safe Function waits for User Click, waits until the element is loaded and then performs a click action
     * @param identifier - locator of element to be found
     * @param friendlyname - name of the element to be found
     * @param timeout - the time in milli seconds to wait until returning a failure
     *
     */
    safeClick : function(client, identifier, friendlyname,timeout){
        timeout = typeof timeout !== 'undefined' ? timeout : 40000;
        this.safeVerifyElementPresent(client,identifier,friendlyname,timeout);
        client
            .click(identifier,function(result){
                if(result.status!==0)
                    logger.error("Unable to click on - "+friendlyname);
                else
                    logger.info("clicked on - "+ friendlyname)
            });
    },

    /**
     * Function - Safe Function waits until the element is loaded and then enters some text
     * @param identifier - locator of element to be found
     * @param friendlyname - name of the element to be found
     * @param texttoenter - text to be entered in element
     * @param timeout - time in milli seconds to wait until returning a failure
     */
    safeType : function(client, identifier, textToEnter, friendlyname, timeout){
        timeout = typeof timeout !== 'undefined' ? timeout : 40000;
        this.safeVerifyElementPresent(client,identifier,friendlyname,timeout);
        client
            .setValue(identifier,textToEnter,function(result){
                if(result.status!==0)
                    logger.error("Unable to enter value into - " + friendlyname);
                else
                    logger.info("Entered value successfully into - "+ friendlyname)
            })
    },

    //Function - Safe Function to verify and accept the alert
    safeAcceptAlert : function(client){
        client
            .acceptAlert(function(result){
                if(result.status!==0)
                    logger.error("Unable to accept the alert");
                else
                    logger.info("Accepted the alert successfully")
            })
    },

    //Function - safe Function to get the text from the alert
    /*returns the value but problem with promises, when calling this method in other file the value is returning null*/
    safeGetAlertText :function(client){
        client
            .getAlertText(function(result){
                if(result.status!==0){
                    logger.error("Unable to get text from alert");
                }
                else
                {
                    logger.info("Retrieved text from alert successfully");
                    logger.info(result.value);
                    return result.value;
                }
            })
    },

    /* function - safe function to send the text to the alert
     @parm textToEnter - text to enter into the alert
     */
    safeSetAlertText : function(client,textToEnter){
        client
            .setAlertText(textToEnter,function(result){
                if(result.status!==0)
                    logger.error("Unable to enter text to alert");
                else
                    logger.info("Entered text into the alert successfully")
            })
    },

    /*
     function - safe function to dismiss the alert
     */
    safeDismissAlert : function(client){
        client
            .dismissAlert(function(result){
                if(result.status!==0)
                    logger.error("Unable to dismiss the alert");
                else
                    logger.info("Dismissed the alert successfully")
            })
    },

    /*function - safe function to verify whether the locator is xpath or css,
     and passes the corresponding method depends upon locator type
     * @param identifier - locator of element to be tested whether it is xpath or css
     */
    verifyLocator : function(client,identifier){
        var locator = identifier.search("//");
        if (locator === -1) {
            client
                .useCss();
        } else {
            client
                .useXpath();
        }
    },

    /**
     * Function - Safe Function to retrieve the text from an element
     * @param identifier - locator of element to be found
     * @param friendlyname - name of the element to be found
     * @param timeout - time in milli seconds to wait until returning a failure
     */
    safeGetText : function(client,identifier,friendlyanme,timeout){
        timeout = typeof timeout !== 'undefined' ? timeout : 40000;
        this.safeVerifyElementPresent(client,identifier,timeout);
        client
            .getText(identifier,function(result){
                if(result.status !== 0)
                {
                    error.message("Unable to retrieve text from - "+friendlyanme);
                }else{
                    console.log("Retrieved text from - "+friendlyanme);
                }
                return result.value;
            })
    },

    /**
     * Function - Safe Function to get required attribute of an element
     * @param identifier - locator of element to be found
     * @param identifier - locator of element to be found
     * @param attribute - attribute whose value to be retrieved
     * @param friendlyname - name of the element to be found
     * @param timeout - time in milli seconds to wait until returning a failure
     */
    safeGetAttribute : function(client,identifier,attribute,friendlyname,timeout){
        timeout = typeof timeout !== 'undefined' ? timeout : 40000;
        this.safeVerifyElementPresent(client,identifier,timeout);
        client
            .getAttribute(identifier,attribute,function(result){
                if(result.status !== 0)
                {
                    error.message("Unable to get the attribute of - "+friendlyname);
                }else{
                    console.log("Retrieved the attribute of - "+friendlyname);
                }
                return result.value;
            })
    },

    /**
     * Function - Safe Function to perform drag and drop operation for a specified element
     * @param sourceElementIdentifier - locator from which the element has to be dragged
     * @param destinationElementIdentifier - locator to which the element has to be dropped
     * @param timeout - time in milli seconds to wait until returning a failure
     **/
    safeDragAndDrop : function(client,sourceElementIdentifier,destinationElementIdentifier,friendlyname,timeout){
        timeout = typeof timeout !== 'undefined' ? timeout : 40000;
        this.safeVerifyElementPresent(client,sourceElementIdentifier,friendlyname,timeout);
        client
            .moveToElement(sourceElementIdentifier, 0, 0)
            .mouseButtonDown(0);
        this.safeVerifyElementPresent(client,destinationElementIdentifier,friendlyname,timeout);
        client
            .moveToElement(destinationElementIdentifier, 0, 0)
            .mouseButtonUp(0);
    },

    /*
     * Function - safe function to perform switching from parent window to child window
     */
    safeSwitchToWindow : function(client){
        client.windowHandles(function(result) {
            var handle = result.value[1];
            logger.info("child window handler=====> "+handle);
            client.switchWindow(handle);
        });
    },

    /*
     * Function - safe function to perform switching from child window to parent window
     */
    safeSwitchToParentWindow : function(client){
        client.windowHandles(function(result) {
            var handle = result.value[0];
            logger.info("parent window handler=====> "+handle);
            client.switchWindow(handle);
        });
    },

    /* function - safe function to perform assertion by verifying with 'containsText'
     * @param identifier - locator of element to be found
     * @param expectedText - expected text that needs to be compared with the actual text
     */
    safeAssertContainsText : function(client,identifier,expectedText) {
        this.verifyLocator(client,identifier);
        client
            .assert.containsText(identifier, expectedText)
    },

    /* function - safe function to check whether the current url contains the expected text or not
     * @param expectedText - expected text which needs to be compared with the url
     */
    safeUrlContains : function(client,expectedText){
        client
            .assert.urlContains(expectedText);
    },

    /* function - safe function to check whether the url equals to the expected url or not
     * @param expectedUrl - the expected url which needs to be checked with the actual url
     */
    safeUrlEquals : function(client,expectedUrl){
        client
            .assert.urlEquals(expectedUrl);
    },

    /* function - safe function to check whether the element is visible or not
     * @param ElementToBeChecked - the element  whose presence needs to be checked
     */
    safeAssertElementVisible : function(client,ElementToBeChecked){
        client
            .assert.visible(ElementToBeChecked);
    },

    /**
     * Function - Safe Function waits until the element is loaded and then performs a right click action
     * @param identifier - locator of element to be found
     * @param friendlyname - name of the element to be found
     * @param timeout - time in milli seconds to wait until returning a failure
     *
     */
    safeRightClick : function (client,identifier, friendlyname, timeout) {
        timeout = typeof timeout !== 'undefined' ? timeout : 40000;
        this.safeVerifyElementPresent(client,identifier, friendlyname, timeout);
        client
            .moveToElement(identifier,0,0)
            .mouseButtonClick('right',function(result){
                if(result.status !== 0){
                    logger.error("Unable perform right click on "+friendlyname);
                }
                else
                {
                    logger.info("Performed right click on "+friendlyname);
                }
            })
    },

    /**
     * Function - Safe Function waits until the element is loaded and then performs a double click action
     * @param identifier - locator of element to be found
     * @param friendlyname - name of the element to be found
     * @param timeout - time in milli seconds to wait until returning a failure
     *
     */
    safeDoubleClick : function (client,identifier, friendlyname, timeout) {
        timeout = typeof timeout !== 'undefined' ? timeout : 40000;
        this.safeVerifyElementPresent(client,identifier, friendlyname, timeout);
        client
            .moveToElement(identifier,0,0)
            .doubleClick(function(result){
                logger.info("=================>"+result.status);
                if(result.status !== 0){
                    logger.error("Unable to perform double click on - "+friendlyname);
                }
                else
                {
                    logger.info("Performed double click on - "+friendlyname);
                }
            });
    },

    /* Function - Safe Function to delete a specific cookie in browser
     @param cookieToBeDeleted - name of the cookie to be deleted from the browser
     */
    clearCookie : function (client,cookieToBeDeleted) {
        client
            .deleteCookie(cookieToBeDeleted,function(result){
                if(result.status !== 0){
                    logger.error("Unable to delete cookie");
                }
                else
                {
                    logger.info("Deleted cookie successfully")
                }
            });
    },

    //Function - Safe Function to delete all the cookies in browser
    clearAllCookies : function (client) {
        client
            .deleteCookies(function(result){
                if(result.status !== 0){
                    logger.error("Unable to delete cookies");
                }
                else
                {
                    logger.info("Deleted cookies successfully")
                }
            })
    },

    /*Function - Safe Function to retrieve a cookie that is visible in the browser
     @param cookieName - name of the cookie which is to be retrieved from the browser
     */
    getCookieInfo : function (client,cookieName) {
        client
            .getCookie(cookieName,function(result){
                if(result.status !== 0){
                    logger.error("Unable to retrieve cookie")
                }
                else
                {
                    logger.info("Successfully retrieved cookie ==> "+result.name);
                    return result.name;
                }
            })

    },

    //Function - Safe Function to retrieve cookies visible in the browser. Returns an array
    getAllCookies : function (client) {
        client
            .getCookies(function(result){
                if(result.status !== 0){
                    logger.error("Unable to retrieve cookies")
                }
                else
                {
                    logger.info("Successfully retrieved cookies from browser");
                    logger.info("Number of cookies "+result.value.length);
                    return result.value.length;
                }
            })
    },

    /* function - safe function to add a new cookie to the browser
     @param nameOfTheCookie - name of the cookie to be added to the browser
     @param valueOfTheCookie - value to provide for the cookie
     */
    addCookie : function(client,nameOfCookie,valueOfCookie){
        client
            .setCookie({
                name: nameOfCookie,
                value: valueOfCookie
            });
    },

    /**
     * Function - Safe Function waits until the element is loaded, then clears existing content and enters given text
     * @param identifier - locator of element to be found
     * @param friendlyName - name of the element to be found
     * @param textToEnter - text to be enter in element
     * @param timeout - time in milli seconds to wait until returning a failure
     */
    safeClearAndType : function (client,identifier,textToEnter, friendlyName,  timeout) {
        timeout = typeof timeout !== 'undefined' ? timeout : 30000;
        this.safeVerifyElementPresent(client,identifier, friendlyName, timeout);
        client
            .clearValue(identifier,function(result){
                if(result.status !== 0){
                    logger.error("Unable to clear the content in - "+friendlyName);
                }
                else
                {
                    logger.info("Cleared content in - " +friendlyName);
                    client
                        .setValue(identifier,textToEnter,function(result){
                            if(result.status ===0)
                            {
                                logger.info("Value entered successfully into - "+ friendlyName)
                            }
                            else
                            {
                                logger.error('Cleared but unable to enter the value into - '+ friendlyName);
                            }
                        })
                }
            })
    },

    /**
     * Function - Safe Function waits until element is loaded and
     * selects a value from dropdown by providing locator of required option in dropdown.
     * @param locatorOfDropDown - locator of dropdown to be found
     * @param locatorOfDropDownOption - locator of option of dropdown to be selected
     * @param friendlyname - name of the element to be found
     * @param timeout - time in milli seconds to wait until returning a failure
     */
    safeSelectOptionFromDropDown : function(client, locatorOfDropDown,locatorOfDropDownOption,friendlyname,timeout){
        timeout = typeof timeout !== 'undefined' ? timeout : 30000;
        this.safeVerifyElementPresent(client,locatorOfDropDown, friendlyname, timeout);
        client
            .click(locatorOfDropDown)
            .click(locatorOfDropDownOption)
            .click(locatorOfDropDown)
    },

    /**
     * Function - Safe Function for checkbox selection. Waits until the element is loaded and then selects checkbox
     * @param checkboxlocator - locator of checkbox to be found
     * @param friendlyname - name of the element to be found
     * @param timeout - time in milli seconds to wait until returning a failure
     */
    safeSelectCheckBox : function (client,checkboxlocator, friendlyname, timeout) {
        timeout = typeof timeout !== 'undefined' ? timeout : 30000;
        this.safeVerifyElementPresent(client,checkboxlocator, friendlyname, timeout);
        client
            .click(checkboxlocator,function(result){
                if(result.status!==0)
                    logger.error("Unable to select checkbox of - "+friendlyname);
                else
                    logger.info("selected checkbox of - "+ friendlyname)
            })
    },

    /**
     * Function - Safe Function for mouse hover, waits until the element is loaded and then hovers on the element
     * @param indentifier - locator of element to be found
     * @param friendlyname - name of the element to be found
     * @param timeout - time in milli seconds to wait until returning a failure
     */
    safeMouseHover : function(client,identifier,friendlyname,timeout){
        timeout = typeof timeout !== 'undefined' ? timeout : 30000;
        this.safeVerifyElementPresent(client,identifier, friendlyname, timeout);
        client
            .moveToElement(identifier, 100, 100, function(result) {
                if(result.status!==0)
                    logger.error("Unable to perform mouse hover on - "+friendlyname);
                else
                    logger.info("successfully mouse hovered on - "+ friendlyname);
            })
    },

    /**
     * Function - Safe Function for radio button selection, waits until the element is loaded and then selects checkbox
     * @param radioButtonLocator - locator of radio button to be found
     * @param friendlyname - name of the element to be found
     * @param timeout - time in milli seconds to wait until returning a failure
     */
    safeSelectRadioBtn : function (client,radioButtonLocator, friendlyname, timeout) {
        timeout = typeof timeout !== 'undefined' ? timeout : 30000;
        this.safeVerifyElementPresent(client,radioButtonLocator, friendlyname, timeout);
        client
            .click(radioButtonLocator,function(result){
                if(result.status!==0)
                    logger.error("Unable to select radio button of - "+friendlyname);
                else
                    logger.info("Selected radio button of - "+ friendlyname)
            })
    },

    /**
     * Function - Safe Function to read text from a file
     * @param filePath - path to the file
     */
    safeGetTextFromTxtFile : function (client,filePath) {
        var check=fs.existsSync(filePath);
        if(check) {
            var data = fs.readFileSync(filePath);
            var text1 = data.toString();
            return (text1);
        }
        else {
            logger.error("File does not exists at - "+filePath);
        }
    },

    /**
     * Function - Safe Function to write text from a file
     * @param filePath - path to the file
     */
    safeTextWriteToFile : function (client,filePath,textToWrite) {
        fs.openSync(filePath, 'w');
        fs.writeFile(filePath,textToWrite);
        logger.info("Successfully written data to file");

    }

};