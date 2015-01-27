describe('Register', function() {
    beforeEach(function() {
        browser.get('/logout');
        browser.get('/login');
    });

    it('should show an error if a email is entered that is already registered', function() {
        element(by.id('signup_name')).sendKeys('Name');
        element(by.id('signup_email')).sendKeys('vendor@bunnies.test');
        element(by.id('signup_password')).sendKeys('password');

        element(by.css('form.register .btn.btn-primary')).click();

        // Should stay on the same page.
        expect(browser.getCurrentUrl()).toMatch(/\/login$/);

        // Should show an error.
        var error = element(by.css('div[ng-controller="RegisterController as register"] p.error'));
        expect(error.getText()).toBe('A user already exists with that email address');
        expect(error.isDisplayed()).toBe(true);
    });

    it('should redirect to the index page upon a successful registration', function() {
        element(by.id('signup_name')).sendKeys('Name');
        element(by.id('signup_email')).sendKeys('e2e-test-user@example.test');
        element(by.id('signup_password')).sendKeys('password');

        element(by.css('form.register .btn.btn-primary')).click();

        // Should redirect to the index page.
        expect(browser.getCurrentUrl()).toMatch(/citypantry\.dev\/$/);
    });
});
