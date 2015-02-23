describe('Vendor portal - create package', function() {
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('vendor@bunnies.test');
            browser.get('/vendor/create-package');
            isFirst = false;
        }
    });

    it('should show the "Create package" page', function() {
        expect(element(by.css('h1')).getText()).toBe('Create package');
    });

    it('should load the package detail options', function() {
        expect(element.all(by.css('#package_cuisine_type option')).get(1).getText()).toBe('British');

        var allergenTypeOptions = element.all(by.repeater('allergenTypeOption in allergenTypeOptions'));
        expect(allergenTypeOptions.get(0).getText()).toContain('Cereals containing gluten');

        var dietaryTypeOptions = element.all(by.repeater('dietaryTypeOption in dietaryTypeOptions'));
        expect(dietaryTypeOptions.get(0).getText()).toContain('Vegetarian');

        var eventTypeOptions = element.all(by.repeater('eventTypeOption in eventTypeOptions'));
        expect(eventTypeOptions.get(0).getText()).toContain('Breakfast');
    });

    it('should show the vendor’s addresses', function() {
        expect(element.all(by.repeater('vendorAddress in vendor.addresses')).count()).toBe(1);
    });

    it('should show an error if an invalid postcode is entered', function() {
        element(by.css('a[ng-click^="addAnotherAddress"]')).click();
        element(by.model('address.postcode')).sendKeys('SW1P');
        element(by.css('button[ng-click^="addAddress"]')).click();

        expect(browser.getCurrentUrl()).toMatch(/\/vendor\/create-package$/);
        var error = element.all(by.css('label[for="address_postcode"] > span.form-element-invalid')).get(1);
        expect(error.getText()).toBe('(Postcode is invalid.)');
        expect(error.isDisplayed()).toBe(true);
    });

    it('should show an error if an invalid mobile number is entered', function() {
        element(by.css('a[ng-click^="addAnotherAddress"]')).click();
        element(by.model('address.orderNotificationMobileNumber')).sendKeys('07777');
        element(by.css('button[ng-click^="addAddress"]')).click();

        expect(browser.getCurrentUrl()).toMatch(/\/vendor\/create-package$/);
        var error = element.all(by.css('label[for="address_order_notification_mobile_number"] > span.form-element-invalid')).get(1);
        expect(error.getText()).toBe('(Order notification mobile number is invalid.)');
        expect(error.isDisplayed()).toBe(true);
    });

    it('should be able to create a package', function() {
        element(by.model('package.cuisineType')).sendKeys('British');
        element(by.model('package.name')).sendKeys('Fish cake');
        element(by.model('package.description')).sendKeys('Consisting of leftover fish and cold potatoes.');
        element(by.model('package.hotFood')).sendKeys(true);
        element(by.model('package.cost')).sendKeys(1.30);
        element(by.model('package.maxPeople')).sendKeys(50);
        element(by.model('package.notice')).sendKeys(1);
        element.all(by.css('input[name="packageDeliveryDays[]"]')).first().click();
        element(by.model('package.deliveryCost')).sendKeys(0);
        element(by.model('package.freeDeliveryThreshold')).sendKeys(0);
        element(by.css('main form input.btn.btn-primary')).click();

        // Should redirect to the packages page.
        expect(browser.getCurrentUrl()).toMatch(/citypantry\.dev\/vendor\/packages$/);
    });
});
