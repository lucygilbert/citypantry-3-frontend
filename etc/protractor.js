var helpers = require('./protractor-helpers.js');

(function() {
    for (var key in helpers) {
        global[key] = helpers[key];
    }

    var getTestFilesForDirectory = function(directory) {
        // Spec patterns are relative to the current working directory when
        // Protractor is called.
        return '../tests/e2e/' + directory + '/**/*.js';
    };

    onPrepare = function() {
        require('jasmine-reporters'); // is not available earlier, so we need to put it in here
        // require('../test/e2e/matchers.js');
        jasmine.getEnv().addReporter(new jasmine.JUnitXmlReporter('build/protractor-logs/', true, true));

        // Sets the width of the window, otherwise the default min width
        // of our site is too small and the login page is unusable.
        // 1200px makes the page go into mobile/tablet view, so use a width greater than that.
        browser.driver.manage().window().setSize(1250, 800);

        // Use BAIL_FAST=1 in your environment to bail on the first failure.
        if (process.env.BAIL_FAST === '1') {
            require('jasmine-bail-fast');
            jasmine.getEnv().bailFast();
        }
    };

    config = {
        framework: 'jasmine',

        // Capabilities to be passed to the webdriver instance.
        capabilities: {
            'browserName': 'chrome',
            'phantomjs.binary.path': '/home/citypantry/project/frontend/node_modules/phantomjs/bin/phantomjs',
        },

        suites: {
            'admin': getTestFilesForDirectory('admin'),
            'authentication': getTestFilesForDirectory('authentication'),
            'customer': getTestFilesForDirectory('customer'),
            'general': getTestFilesForDirectory('general'),
            'user': getTestFilesForDirectory('user'),
            'vendor': getTestFilesForDirectory('vendor'),
        },

        onPrepare: onPrepare,

        jasmineNodeOpts: {
            showColors: true,
            defaultTimeoutInterval: 30000
        },

        allScriptsTimeout: 30000,
        baseUrl: 'http://order.citypantry.dev/',
    };

    if (process.env.LOCAL_SELENIUM === '1') {
        config.seleniumAddress = 'http://localhost:4444/wd/hub';
    }

    exports.config = config;
}).call(this);
