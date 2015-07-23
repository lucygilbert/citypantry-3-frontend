describe('Register as a customer', function() {
    var company;
    var name;
    var email;
    var password;
    var selfIdentifiedPersonas;
    var registerButton;

    beforeEach(function() {
        browser.get('/logout');
        browser.get('/register');

        company = element(by.id('registerCompany'));
        name = element(by.id('registerName'));
        email = element(by.id('registerEmail'));
        password = element(by.id('registerPassword'));
        selfIdentifiedPersonas = element(by.model('selfIdentifiedPersona'));
        registerButton = element(by.css('form.cp-login-form .cp-btn-primary'));
    });

    it('should have several self-identitied persona options', function() {
        // There should be 5 persona options and 1 empty default option.
        expect(selfIdentifiedPersonas.all(by.css('option')).count())
            .toBe(6);
    });

    it('should show an error if an email is entered that is already registered', function() {
        company.sendKeys('Burger Palace');
        name.sendKeys('Name');
        email.sendKeys('vendor@bunnies.test');
        password.sendKeys('password');

        registerButton.click();

        // Should stay on the same page.
        expect(browser.getCurrentUrl()).toMatch(/\.dev\/register$/);

        // Should show an error.
        var error = element(by.css('.cp-form-error'));
        expect(error.getText()).toBe('A user already exists with that email address');
        expect(error.isDisplayed()).toBe(true);
    });

    it('should redirect to the index page upon a successful registration', function() {
        company.sendKeys('Burger Palace');
        name.sendKeys('Name');
        email.sendKeys('e2e-test-user@example.test');
        password.sendKeys('password');

        registerButton.click();

        // Should redirect to the customer dashboard.
        expect(browser.getCurrentUrl()).toMatch(/\.dev\/customer\/dashboard$/);
    });
});
