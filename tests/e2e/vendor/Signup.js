describe('Vendor signup', function() {
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            logout();
            browser.get('/vendor/signup');
            isFirst = false;
        }
    });

    it('should show the "Vendor signup" page', function() {
        expect(element(by.css('h2.cp-heading')).getText()).toBe('APPLY TO SELL CATERING WITH US');
    });

    it('should load the vendor type options', function() {
        expect(element.all(by.css('#vendor_type option')).get(1).getText()).toBe('Chef');
    });

    it('should show an error if an invalid postcode is entered', function() {
        element(by.model('address.postcode')).sendKeys('SW1P');
        element(by.css('main form .btn.btn-primary')).click();

        expect(browser.getCurrentUrl()).toMatch(/\/vendor\/signup$/);
        var error = element.all(by.css('label[for="address_postcode"] > span.form-element-invalid')).get(1);
        expect(error.getText()).toBe('(Postcode is invalid.)');
        expect(error.isDisplayed()).toBe(true);
    });

    it('should show an error if an invalid mobile number is entered', function() {
        element(by.model('address.mobileNumber')).sendKeys('07777');
        element(by.css('main form .btn.btn-primary')).click();

        expect(browser.getCurrentUrl()).toMatch(/\/vendor\/signup$/);
        var error = element.all(by.css('label[for="address_mobile_number"] > span.form-element-invalid')).get(1);
        expect(error.getText()).toBe('(Mobile number is invalid.)');
        expect(error.isDisplayed()).toBe(true);
    });

    it('should show an error if an email is entered that is already registered', function() {
        element(by.model('vendor.name')).sendKeys('Deep Blue');
        element(by.model('vendor.type')).sendKeys('Chef');
        element(by.model('address.addressLine1')).sendKeys('Francis House');
        element(by.model('address.addressLine2')).sendKeys('11 Francis Street');
        element(by.model('address.addressLine3')).sendKeys('Westminster');
        element(by.model('address.city')).sendKeys('London');
        element(by.model('address.postcode')).clear().sendKeys('SW1P 1DE');
        element(by.model('address.landlineNumber')).sendKeys('020 3397 8376');
        element(by.model('address.mobileNumber')).clear().sendKeys('07102869052');
        element(by.model('name')).sendKeys('Mollie Stevens');
        element(by.model('email')).sendKeys('vendor@bunnies.test');
        element(by.model('plainPassword')).sendKeys('password');

        element(by.css('main form .btn.btn-primary')).click();

        // Should stay on the same page.
        expect(browser.getCurrentUrl()).toMatch(/\/vendor\/signup$/);

        // Should show an error.
        var error = element.all(by.css('label[for="email"] > span.form-element-invalid')).get(2);
        expect(error.getText()).toBe('(A user already exists with that email address.)');
        expect(error.isDisplayed()).toBe(true);
    });

    it('should redirect to the signup package page upon a successful registration', function() {
        element(by.model('email')).clear().sendKeys('mollie@bunnies.test');
        element(by.css('main form .btn.btn-primary')).click();

        // Should redirect to the signup package page.
        expect(browser.getCurrentUrl()).toMatch(/citypantry\.dev\/vendor\/signup\/package$/);
    });
});
