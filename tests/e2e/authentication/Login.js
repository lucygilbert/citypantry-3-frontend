describe('Login', function() {
    var notificationModal = require('../NotificationModal.js');

    beforeEach(function() {
        browser.get('/logout');
        browser.get('/login');
    });

    function expectSamePageWithErrorShowing() {
        expect(browser.getCurrentUrl()).toMatch(/\/login$/);

        var error = element(by.css('.cp-form-error'));
        expect(error.getText()).toBe('Email/password is incorrect');
        expect(error.isDisplayed()).toBe(true);
    }

    it('should show an error if an incorrect email address is entered', function() {
        element(by.id('login_email')).sendKeys('wrong@wrong.wrong');
        element(by.id('login_password')).sendKeys('password');

        element(by.css('.cp-login-form input[type="submit"]')).click();

        expectSamePageWithErrorShowing();
    });

    it('should show an error if an incorrect password is entered', function() {
        element(by.id('login_email')).sendKeys('alice@bunnies.test');
        element(by.id('login_password')).sendKeys('wrong');

        element(by.css('.cp-login-form input[type="submit"]')).click();

        expectSamePageWithErrorShowing();
    });

    it('should redirect to the index page upon a successful login', function() {
        element(by.id('login_email')).sendKeys('alice@bunnies.test');
        element(by.id('login_password')).sendKeys('password');

        element(by.css('.cp-login-form input[type="submit"]')).click();

        // Should redirect to the index page.
        expect(browser.getCurrentUrl()).toMatch(/citypantry\.dev\/admin\/orders$/);
    });

    it('should send a reset email and clear and close the dialog', function() {
        element(by.css('.cp-login-forgot-password')).click();
        element(by.id('email')).sendKeys('customer@bunnies.test');
        element(by.css('.cp-modal button[type="submit"]')).click();

        notificationModal.expectIsOpen();
        notificationModal.expectSuccessHeader();
        notificationModal.dismiss();

        expect(element(by.id('email')).getAttribute('value')).toBe('');
        expect(element(by.css('.cp-login-forgot-password-modal')).isDisplayed()).toBe(false);
    });

    it('should call an error if the email is not a customer\'s email', function() {
        element(by.css('.cp-login-forgot-password')).click();
        element(by.id('email')).sendKeys('c@c.c');
        element(by.css('.cp-modal button[type="submit"]')).click();

        notificationModal.expectIsOpen();
        notificationModal.expectErrorHeader();
        notificationModal.dismiss();
    });

    it('should clear and close the dialog if the X button is clicked', function() {
        element(by.css('.cp-login-forgot-password')).click();
        element(by.css('.close')).click();

        expect(element(by.id('email')).getAttribute('value')).toBe('');
        expect(element(by.css('.cp-login-forgot-password-modal')).isDisplayed()).toBe(false);
    });
});
