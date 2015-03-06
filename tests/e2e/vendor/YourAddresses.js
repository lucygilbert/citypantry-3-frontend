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

    it('should have one address', function() {
        var addresses = element.all(by.repeater('address in addresses'));
        expect(addresses.count()).toBe(1);
        expect(addresses.get(0).getText()).toContain('Shepherds Bush Road, London, W6, United Kingdom');
    });

    it('should be able to add an address', function() {
        var addAddressButton = element.all(by.css('main button')).get(1);
        expect(addAddressButton.getText()).toBe('Add another business address');
        addAddressButton.click();

        expect(browser.getCurrentUrl()).toMatch(/vendor\/new-address$/);

        element(by.model('address.addressLine1')).sendKeys('11 Francis Street');
        element(by.model('address.city')).sendKeys('London');
        element(by.model('address.postcode')).sendKeys('SW1P 1AA');
        element(by.model('address.landlineNumber')).sendKeys('020 123 123');
        element(by.model('address.orderNotificationMobileNumber')).sendKeys('07111222333');
        element(by.model('address.contactName')).sendKeys('Stu');

        element(by.css('main input.btn-primary')).click();

        expect(browser.getCurrentUrl()).toMatch(/vendor\/addresses$/);

        var addresses = element.all(by.repeater('address in addresses'));
        expect(addresses.count()).toBe(2);
        expect(addresses.get(1).getText()).toContain('11 Francis Street, London, SW1P 1AA, United Kingdom');
    });
});
