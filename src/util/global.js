
module.exports = {
    'local-env' : {
        isLocal : false
    },

    'remote-env' : {
        isLocal : true
    },

    before: function(done) {
        // run this only for the local-env
        if (this.isLocal) {

            // start the local server
            App.startServer(function() {
                // server listening
                done();
            });
        } else {
            done();
        }
    },

    after: function(done) {
        // run this only for the local-env
        if (this.isLocal) {
            // start the local server
            App.stopServer(function() {
                // shutting down
                done();
            });
        } else {
            done();
        }
    },

    // This will be run before each test suite is started
    beforeEach: function(browser, done) {
        // getting the session info
        browser.status(function(result) {
            console.log(result.value);
            done();
        });
    },

    // This will be run after each test suite is finished
    afterEach: function(browser, done) {
        console.log("CURRENT TEST___________________ "+browser.currentTest);
        done();
    }
};