describe('Customer delivery addresses', function() {
    var first = true;
    var notificationModal = require('../NotificationModal.js');

    beforeEach(function() {
        if (first) {
            first = false;
            loginAsUser('customer@bunnies.test');
            browser.get('/customer/addresses');
        }
    });

    it('should show the addresses page', function() {
        var headers = element.all(by.css('main h2'));
        expect(headers.get(0).getText()).toBe('DELIVERY ADDRESSES');
        expect(headers.get(1).getText()).toBe('BILLING ADDRESSES');
    });

    it('should have one delivery address', function() {
        var addresses = element.all(by.repeater('deliveryAddress in deliveryAddresses'));
        expect(addresses.count()).toBe(1);
        expect(addresses.get(0).getText()).toContain('25 Lena Gardens, London, W6 7PY, United Kingdom');
    });

    it('should have one billing address', function() {
        var addresses = element.all(by.repeater('billingAddress in billingAddresses'));
        expect(addresses.count()).toBe(1);
        expect(addresses.get(0).getText()).toContain('Mega Things Ltd Accounts, 25 Lena Gardens, London, W6 7PY');
    });

    it('should be able to open the "add delivery address" page', function() {
        var addAddressButton = element(by.css('.cp-add-delivery-address'));
        expect(addAddressButton.getText()).toBe('ADD A NEW ADDRESS');
        addAddressButton.click();

        expect(browser.getCurrentUrl()).toMatch(/customer\/addresses\/delivery\/new$/);
    });

    it('should be able to fill in the "add address" form', function() {
        element(by.model('address.addressLine1')).sendKeys('11 Francis Street');
        element(by.model('address.city')).sendKeys('London');
        element(by.model('address.postcode')).sendKeys('SW1P 1AA');
        element(by.model('address.landlineNumber')).sendKeys('020 123 123');
        element(by.model('address.officeManagerName')).sendKeys('Stu');
        element(by.model('address.companyName')).sendKeys('City Pantry');

        // The order notification mobile number, and contact name, is only for vendors.
        expect(element(by.model('address.orderNotificationMobileNumbersCommaSeparated')).isPresent()).toBe(false);
        expect(element(by.model('address.contactName')).isPresent()).toBe(false);
    });

    it('should be able to save the "add address" form', function() {
        element(by.css('main input.btn-primary')).click();

        // No notification -- just go back to the addresses page.
        notificationModal.expectIsClosed();

        expect(browser.getCurrentUrl()).toMatch(/customer\/addresses$/);
    });

    it('should list the new address in the address list', function() {
        var addresses = element.all(by.repeater('deliveryAddress in deliveryAddresses'));
        expect(addresses.count()).toBe(2);
        expect(addresses.get(1).getText()).toContain('11 Francis Street, London, SW1P 1AA, United Kingdom');
    });

    it('should be able to open the "edit address" page', function() {
        var editAddressButton = element.all(by.css('.cp-edit-address')).get(0);
        expect(editAddressButton.getText()).toBe('EDIT');
        editAddressButton.click();

        expect(browser.getCurrentUrl()).toMatch(/customer\/addresses\/delivery\/[0-9a-f]{24}$/);
    });

    it('should be able to fill in the "edit address" form', function() {
        expect(element(by.model('address.addressLine2')).getAttribute('value')).toBe('25 Lena Gardens');
        expect(element(by.model('address.city')).getAttribute('value')).toBe('London');

        // The order notification mobile number, and contact name, is only for vendors.
        expect(element(by.model('address.orderNotificationMobileNumbersCommaSeparated')).isPresent()).toBe(false);
        expect(element(by.model('address.contactName')).isPresent()).toBe(false);

        element(by.model('address.city')).clear().sendKeys('Albuquerque');
        element(by.model('address.companyName')).clear().sendKeys('Some Company');
    });

    it('should be able to save the "edit address" form', function() {
        element(by.css('main input.btn-primary')).click();

        // No notification -- just go back to the addresses page.
        notificationModal.expectIsClosed();

        expect(browser.getCurrentUrl()).toMatch(/customer\/addresses$/);
    });

    it('should show the edited address details in the address list', function() {
        var addresses = element.all(by.repeater('deliveryAddress in deliveryAddresses'));
        expect(addresses.get(0).getText()).toContain('25 Lena Gardens, Albuquerque, W6 7PY, United Kingdom');
    });

    it('should revert the changes so other tests are not broken', function() {
        var editAddressButton = element.all(by.css('.cp-edit-address')).get(0);
        editAddressButton.click();

        element(by.model('address.city')).clear().sendKeys('London');

        element(by.css('main input.btn-primary')).click();

        var addresses = element.all(by.repeater('deliveryAddress in deliveryAddresses'));
        expect(addresses.get(0).getText()).toContain('25 Lena Gardens, London, W6 7PY, United Kingdom');
    });

    it('should be able to use a billing address for invoices and receipts', function() {
        var firstBillingAddress = element.all(by.repeater('billingAddress in billingAddresses')).get(0);

        expect(firstBillingAddress.getText()).toContain('Use');
        expect(firstBillingAddress.getText()).not.toContain('Yes');

        firstBillingAddress.element(by.css('a.cp-use-address-for-invoices-and-receipts')).click();

        expect(firstBillingAddress.getText()).toContain('Yes');
        expect(firstBillingAddress.getText()).not.toContain('Use');
    });
});
