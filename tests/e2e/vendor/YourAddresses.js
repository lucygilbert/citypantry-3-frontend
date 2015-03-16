describe('Vendor portal - your addresses', function() {
    var first = true;

    beforeEach(function() {
        if (first) {
            first = false;
            loginAsUser('vendor@bunnies.test');
            browser.get('/vendor/addresses');
        }
    });

    it('should show the addresses page', function() {
        expect(element(by.css('h1')).getText()).toBe('Your business addresses');
    });

    it('should have three addresses', function() {
        var addresses = element.all(by.repeater('address in addresses'));
        expect(addresses.count()).toBe(3);
        expect(addresses.get(0).getText()).toContain('Shepherds Bush Road, London, W6, United Kingdom');
        expect(addresses.get(1).getText()).toContain('Francis House, 11 Francis Street, Westminster, London, SW1P 1DE');
        expect(addresses.get(2).getText()).toContain('Jeremy House, 22 Jeremy Road');
    });

    it('should be able to add an address', function() {
        var addAddressButton = element(by.css('main button.add-address'));
        expect(addAddressButton.getText()).toBe('Add another business address');
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

        var addresses = element.all(by.repeater('address in addresses'));
        expect(addresses.count()).toBe(4);
        expect(addresses.get(3).getText()).toContain('33 Hello Court, London, HP19 0GH, United Kingdom');
    });
});
