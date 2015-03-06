describe('Customer delivery addresses', function() {
    var first = true;

    beforeEach(function() {
        if (first) {
            first = false;
            loginAsUser('customer@bunnies.test');
            browser.get('/customer/addresses');
        }
    });

    it('should show the addresses page', function() {
        expect(element(by.css('h1')).getText()).toBe('Delivery addresses');
    });

    it('should have one address', function() {
        var addresses = element.all(by.repeater('address in addresses'));
        expect(addresses.count()).toBe(1);
        expect(addresses.get(0).getText()).toContain('25 Lena Gardens, London, W6 7PY, United Kingdom');
    });

    it('should be able to add an address', function() {
        var addAddressButton = element.all(by.css('main p a')).get(0);
        expect(addAddressButton.getText()).toBe('Add a new address');
        addAddressButton.click();

        expect(browser.getCurrentUrl()).toMatch(/customer\/addresses\/new$/);

        element(by.model('address.addressLine1')).sendKeys('11 Francis Street');
        element(by.model('address.city')).sendKeys('London');
        element(by.model('address.postcode')).sendKeys('SW1P 1AA');
        element(by.model('address.landlineNumber')).sendKeys('020 123 123');
        element(by.model('address.officeManagerName')).sendKeys('Stu');
        element(by.model('address.companyName')).sendKeys('City Pantry');

        // The order notification mobile number, and contact name, is only for vendors.
        expect(element(by.model('address.orderNotificationMobileNumber')).isPresent()).toBe(false);
        expect(element(by.model('address.contactName')).isPresent()).toBe(false);

        element(by.css('main input.btn-primary')).click();

        expect(browser.getCurrentUrl()).toMatch(/customer\/addresses$/);

        var addresses = element.all(by.repeater('address in addresses'));
        expect(addresses.count()).toBe(2);
        expect(addresses.get(1).getText()).toContain('11 Francis Street, London, SW1P 1AA, United Kingdom');
    });
});
