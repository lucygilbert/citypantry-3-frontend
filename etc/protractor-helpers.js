module.exports = {
    logout: function() {
        browser.get('/logout');

        browser.driver.wait(function() {
            return browser.driver.getCurrentUrl().then(function(url) {
                return (/\/$/.test(url));
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

        element(by.css('form.login .btn.btn-primary')).click();

        browser.driver.wait(function() {
            return browser.driver.getCurrentUrl().then(function(url) {
                return (/\/$/.test(url));
            });
        });
    },
}
