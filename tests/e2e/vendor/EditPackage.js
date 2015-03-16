describe('Vendor portal - edit package', function() {
    var notificationModal = require('../NotificationModal.js');

    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('vendor@bunnies.test');
            browser.get('/vendor/packages');
            element.all(by.css('#table_packages a.edit-package')).get(0).click();
            isFirst = false;
        }
    });

    it('should show the "Edit package" page', function() {
        expect(browser.getCurrentUrl()).toMatch(/\/vendor\/packages\/[\da-f]{24}$/);
        expect(element(by.css('h1')).getText()).toBe('Edit package');
    });

    it('should load select options and checkboxes', function() {
        // Cuisine types.
        expect(element.all(by.css('#package_cuisine_type > option')).count()).toBe(12);
        expect(element.all(by.css('#package_cuisine_type > option')).get(0).getText()).toBe('British');

        // Dietary types.
        expect(element.all(by.repeater('dietaryTypeOption in dietaryTypeOptions')).count()).toBe(6);
        expect(element.all(by.repeater('dietaryTypeOption in dietaryTypeOptions')).get(0).getText()).toContain('Vegetarian');

        // Allergen types.
        expect(element.all(by.repeater('allergenTypeOption in allergenTypeOptions')).count()).toBe(14);
        expect(element.all(by.repeater('allergenTypeOption in allergenTypeOptions')).get(0).getText()).toContain('Cereals containing gluten');

        // Event types.
        expect(element.all(by.repeater('eventTypeOption in eventTypeOptions')).count()).toBe(7);
        expect(element.all(by.repeater('eventTypeOption in eventTypeOptions')).get(0).getText()).toContain('Breakfast');
    });

    it('should load the package details', function() {
        expect(element(by.id('package_cuisine_type')).$('option:checked').getText()).toBe('European');
        expect(element(by.model('package.name')).getAttribute('value')).toBe('Carrots');
        expect(element(by.model('package.description')).getAttribute('value')).toBe('Yum');

        var packageItems = element.all(by.css('input[name="packageItems[]"]'));
        expect(packageItems.get(0).getAttribute('value')).toBe('Orange carrots');
        expect(packageItems.get(1).getAttribute('value')).toBe('White carrots');

        // Dietary type: "Vegetarian", "Vegan".
        expect(element.all(by.css('input[name="packageDietaryTypes[]"]')).get(0).isSelected()).toBe(true);
        expect(element.all(by.css('input[name="packageDietaryTypes[]"]')).get(1).isSelected()).toBe(true);
        expect(element.all(by.css('input[name="packageDietaryTypes[]"]')).get(2).isSelected()).toBe(false);

        // Allergen type: "Sulphur dioxide, which is a preservative found in some dried fruit".
        expect(element.all(by.css('input[name="packageAllergenTypes[]"]')).get(11).isSelected()).toBe(true);
        expect(element.all(by.css('input[name="packageAllergenTypes[]"]')).get(0).isSelected()).toBe(false);

        // Event types: "Breakfast" and "Christmas".
        expect(element.all(by.css('input[name="packageEventTypes[]"]')).get(0).isSelected()).toBe(true);
        expect(element.all(by.css('input[name="packageEventTypes[]"]')).get(6).isSelected()).toBe(true);
        expect(element.all(by.css('input[name="packageEventTypes[]"]')).get(1).isSelected()).toBe(false);

        expect(element.all(by.css('input[name="packageHotFood"]')).get(1).isSelected()).toBe(true);
        expect(element(by.model('package.costIncludingVat')).getAttribute('value')).toBe('20');

        // Delivery days: "Monday", "Tuesday" and "Wednesday".
        expect(element.all(by.css('input[name="packageDeliveryDays[]"]')).get(0).isSelected()).toBe(true);
        expect(element.all(by.css('input[name="packageDeliveryDays[]"]')).get(1).isSelected()).toBe(true);
        expect(element.all(by.css('input[name="packageDeliveryDays[]"]')).get(2).isSelected()).toBe(true);
        expect(element.all(by.css('input[name="packageDeliveryDays[]"]')).get(3).isSelected()).toBe(false);
    });

    it('should show 2 package item textboxes', function() {
        expect(element.all(by.css('input[name="packageItems[]"]')).count()).toBe(2);
    });

    it('should be able to add a package item textbox', function() {
        element(by.css('a[ng-click="addPackageItem()"]')).click();
        expect(element.all(by.css('input[name="packageItems[]"]')).count()).toBe(3);
    });

    it('should show a notes textbox for the vegetarian dietary type', function() {
        expect(element.all(by.css('input[name="packageDietaryTypeNotes[]"]')).get(0).isDisplayed()).toBe(true);
    });

    it('should load the vendor\'s addresses', function() {
        var addresses = element.all(by.repeater('vendorAddress in vendor.addresses'));
        expect(addresses.count()).toBe(1);
        expect(addresses.get(0).getText()).toContain('Shepherds Bush Road, London, W6, United Kingdom');
    });

    it('should be able to add an address', function() {
        element(by.css('button[ng-click="addAnotherAddress()"]')).click();

        element(by.model('address.addressLine1')).sendKeys('Francis House');
        element(by.model('address.addressLine2')).sendKeys('11 Francis Street');
        element(by.model('address.addressLine3')).sendKeys('Westminster');
        element(by.model('address.city')).sendKeys('London');
        element(by.model('address.postcode')).sendKeys('SW1P 1DE');
        element(by.model('address.landlineNumber')).sendKeys('020 3397 8376');
        element(by.model('address.orderNotificationMobileNumber')).sendKeys('07861795252');
        element(by.model('address.contactName')).sendKeys('Stu');

        element(by.css('button[ng-click="addAddress()"]')).click();

        var addresses = element.all(by.repeater('vendorAddress in vendor.addresses'));
        expect(addresses.count()).toBe(2);
        expect(addresses.get(1).getText()).toContain('Francis House, 11 Francis Street, Westminster, London, SW1P 1DE, United Kingdom');
    });

    it('should set default values for the new address', function() {
        // Address is selected.
        expect(element.all(by.css('input[name="vendorAddressIsSelected[]"]')).get(1).isSelected()).toBe(true);

        // Delivery radius is 2 miles.
        expect(element(by.css('select[id="delivery_radius2"] > option:nth-child(2)')).isSelected()).toBe(true);
    });

    it('should show an error if an invalid postcode is entered', function() {
        element(by.css('button[ng-click="addAnotherAddress()"]')).click();
        element(by.model('address.postcode')).sendKeys('QWERTY');
        element(by.css('button[ng-click="addAddress()"]')).click();

        var invalidPostcodeError = element.all(by.css('label[for="address_postcode"] > .form-element-invalid')).get(1);
        expect(invalidPostcodeError.getText()).toBe('(Postcode is invalid.)');
        expect(invalidPostcodeError.isDisplayed()).toBe(true);

        element(by.css('.modal .close')).click();
    });

    it('should show an error if an invalid mobile number is entered', function() {
        element(by.css('button[ng-click="addAnotherAddress()"]')).click();
        element(by.model('address.orderNotificationMobileNumber')).sendKeys('020 3397 8376');
        element(by.css('button[ng-click="addAddress()"]')).click();

        var invalidMobileNumberError = element.all(by.css('label[for="address_order_notification_mobile_number"] > .form-element-invalid')).get(1);
        expect(invalidMobileNumberError.getText()).toBe('(Order notification mobile number is invalid.)');
        expect(invalidMobileNumberError.isDisplayed()).toBe(true);

        element(by.css('.modal .close')).click();
    });

    it('should show an error if 0 delivery addresses are selected', function() {
        var firstAddressCheckbox = element.all(by.css('input[name="vendorAddressIsSelected[]"]')).get(0);
        firstAddressCheckbox.click();
        var secondAddressCheckbox = element.all(by.css('input[name="vendorAddressIsSelected[]"]')).get(1);
        secondAddressCheckbox.click();
        element(by.css('main input.btn.btn-primary')).click();

        var deliveryAddressError = element.all(by.css('legend[id="package_delivery_addresses"] > .form-element-invalid')).get(0);
        expect(deliveryAddressError.getText()).toBe('(Please specify at least one delivery address.)');
        expect(deliveryAddressError.isDisplayed()).toBe(true);

        // Revert the changes so other tests will pass.
        firstAddressCheckbox.click();
        secondAddressCheckbox.click();
    });

    it('should show an error if minimum people is greater than maximum people', function() {
        var minPeopleOptions = element.all(by.css('#package_min_people > option'));
        minPeopleOptions.get(2).click(); // 2 people.
        var maxPeopleOptions = element.all(by.css('#package_max_people > option'));
        maxPeopleOptions.get(1).click(); // 1 person.
        element(by.css('main input.btn.btn-primary')).click();

        var greaterThanError = element(by.css('legend[id="package_min_max_people"] > .form-element-invalid'));
        expect(greaterThanError.getText()).toBe('(Package maximum must be greater than package minimum.)');
        expect(greaterThanError.isDisplayed()).toBe(true);

        // Revert the changes so other tests will pass.
        minPeopleOptions.get(9).click(); // 10 people.
        maxPeopleOptions.get(33).click(); // 50 people.
    });

    it('should be able to save the details', function() {
        var deliveryCost = element(by.id('package_delivery_cost'));
        var dietaryTypeDairyFreeCheckbox = element.all(by.css('input[name="packageDietaryTypes[]"]')).get(5);
        var dietaryTypeGlutenFreeCheckbox = element.all(by.css('input[name="packageDietaryTypes[]"]')).get(3);
        var eventTypeDinnerCheckbox = element.all(by.css('input[name="packageEventTypes[]"]')).get(2);
        var eventTypeLunchCheckbox = element.all(by.css('input[name="packageEventTypes[]"]')).get(1);
        var freeDeliveryThreshold = element(by.id('package_free_delivery_threshold'));
        var packageDescription = element(by.id('package_description'));
        var packageItems = element.all(by.css('input[name="packageItems[]"]'));

        // Edit some of the details before saving.

        packageDescription.sendKeys(' yum');

        element(by.css('a[ng-click="addPackageItem()"]')).click();
        packageItems.get(2).sendKeys('Purple carrots');

        // Dietary types: "Gluten free" and "Dairy free".
        dietaryTypeGlutenFreeCheckbox.click();
        dietaryTypeDairyFreeCheckbox.click();

        // Event types: "Lunch" and "Dinner".
        eventTypeLunchCheckbox.click();
        eventTypeDinnerCheckbox.click();

        element.all(by.css('#package_notice > option')).get(3).click(); // 3 hours notice.
        element.all(by.css('#package_delivery_time_start > option')).get(13).click(); // 06:00 start time.
        element.all(by.css('#package_delivery_time_end > option')).get(37).click(); // 18:00 end time.
        deliveryCost.sendKeys(15);
        freeDeliveryThreshold.sendKeys(100);

        element(by.css('main input.btn.btn-primary')).click();

        notificationModal.expectIsOpen();
        notificationModal.expectSuccessHeader();
        notificationModal.expectMessage('Your package has been updated.');
        notificationModal.dismiss();

        // Should remain on the package page.
        expect(browser.getCurrentUrl()).toMatch(/citypantry\.dev\/vendor\/packages\/[\da-f]{24}/);

        browser.refresh();

        expect(packageDescription.getAttribute('value')).toBe('Yum yum');
        expect(packageItems.get(2).getAttribute('value')).toBe('Purple carrots');
        expect(dietaryTypeGlutenFreeCheckbox.isSelected()).toBe(true);
        expect(dietaryTypeDairyFreeCheckbox.isSelected()).toBe(true);
        expect(eventTypeLunchCheckbox.isSelected()).toBe(true);
        expect(eventTypeDinnerCheckbox.isSelected()).toBe(true);
        expect(deliveryCost.getAttribute('value')).toBe('15');
        expect(freeDeliveryThreshold.getAttribute('value')).toBe('100');

        // Revert the changes so other tests will pass.
        packageDescription.clear().sendKeys('Yum');
        packageItems.get(2).clear();
        dietaryTypeGlutenFreeCheckbox.click();
        dietaryTypeDairyFreeCheckbox.click();
        eventTypeLunchCheckbox.click();
        eventTypeDinnerCheckbox.click();
        element(by.css('main input.btn.btn-primary')).click();
    });
});
