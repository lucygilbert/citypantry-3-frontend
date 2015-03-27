describe('Vendor portal - your addresses', function() {
    var first = true;
    var notificationModal = require('../NotificationModal.js');

    beforeEach(function() {
        if (first) {
            first = false;
            loginAsUser('vendor@bunnies.test');
            browser.get('/vendor/addresses');
        }
    });

    it('should show the addresses page', function() {
        expect(element(by.css('h1')).getText()).toBe('YOUR BUSINESS ADDRESSES');
    });

    it('should have three addresses', function() {
        var addresses = element.all(by.repeater('address in addresses'));
        expect(addresses.count()).toBe(3);
        expect(addresses.get(0).getText()).toContain('Shepherds Bush Road, London, W6, United Kingdom');
        expect(addresses.get(1).getText()).toContain('Francis House, 11 Francis Street, Westminster, London, SW1P 1DE');
        expect(addresses.get(2).getText()).toContain('Jeremy House, 22 Jeremy Road');
    });

    it('should be able to add an address', function() {
        var addAddressButton = element(by.css('main a.add-address'));
        expect(addAddressButton.getText()).toBe('ADD ANOTHER BUSINESS ADDRESS');
        addAddressButton.click();

        expect(browser.getCurrentUrl()).toMatch(/vendor\/new-address$/);

        element(by.model('address.addressLine1')).sendKeys('33 Hello Court');
        element(by.model('address.city')).sendKeys('London');
        element(by.model('address.postcode')).sendKeys('HP19 0GH');
        element(by.model('address.landlineNumber')).sendKeys('020 123 123');
        element(by.model('address.orderNotificationMobileNumber')).sendKeys('07111222333');
        element(by.model('address.contactName')).sendKeys('Bob');

        element(by.css('main input.btn-primary')).click();

        expect(browser.getCurrentUrl()).toMatch(/vendor\/addresses$/);

        notificationModal.expectIsOpen();
        notificationModal.expectSuccessHeader();
        notificationModal.expectMessage('Address saved');
        notificationModal.dismiss();

        var addresses = element.all(by.repeater('address in addresses'));
        expect(addresses.count()).toBe(4);
        expect(addresses.get(3).getText()).toContain('33 Hello Court, London, HP19 0GH, United Kingdom');
    });

    it('should be able to edit an address', function() {
        var editAddressButton = element.all(by.css('.cp-edit-address')).get(0);
        expect(editAddressButton.getText()).toBe('EDIT');
        editAddressButton.click();

        expect(browser.getCurrentUrl()).toMatch(/vendor\/addresses\/[0-9a-f]{24}$/);

        expect(element(by.model('address.addressLine1')).getAttribute('value')).toBe('Shepherds Bush Road');
        expect(element(by.model('address.city')).getAttribute('value')).toBe('London');

        element(by.model('address.city')).clear().sendKeys('Albuquerque');
        element(by.model('address.orderNotificationMobileNumber')).clear().sendKeys('07123456789');
        element(by.model('address.postcode')).clear().sendKeys('W6 7ZZ');

        element(by.css('main input.btn-primary')).click();

        notificationModal.expectIsOpen();
        notificationModal.expectSuccessHeader();
        notificationModal.expectMessage('Address saved');
        notificationModal.dismiss();

        expect(browser.getCurrentUrl()).toMatch(/vendor\/addresses$/);

        var addresses = element.all(by.repeater('address in addresses'));
        expect(addresses.get(0).getText()).toContain('Shepherds Bush Road, Albuquerque, W6 7ZZ, United Kingdom');
    });

    it('should revert the changes so other tests are not broken', function() {
        var editAddressButton = element.all(by.css('.cp-edit-address')).get(0);
        editAddressButton.click();

        element(by.model('address.city')).clear().sendKeys('London');

        element(by.css('main input.btn-primary')).click();

        notificationModal.dismiss();

        var addresses = element.all(by.repeater('address in addresses'));
        expect(addresses.get(0).getText()).toContain('Shepherds Bush Road, London, W6 7ZZ, United Kingdom');
    });
});
