module.exports = {
    logout: function() {
        browser.get('/logout');

        browser.driver.wait(function() {
            return browser.driver.getCurrentUrl().then(function(url) {
                return (/\/login$/.test(url));
            });
        });
    },

    loginAsUser: function(email) {
        if (!email) {
            throw new Error('Must give an email address!');
        }

        browser.get('/logout');
        browser.get('/login');

        element(by.id('login_email')).sendKeys(email);
        element(by.id('login_password')).sendKeys('password');

        element(by.css('.cp-login-form input[type="submit"]')).click();

        browser.wait(function() {
            return browser.getCurrentUrl().then(function(url) {
                return (/\.dev\/search$/.test(url));
            });
        });
    },
}
