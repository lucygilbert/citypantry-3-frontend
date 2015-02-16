describe('Vendor portal - your addresses', function() {
    var first = true;

    beforeEach(function() {
        if (first) {
            first = false;
            loginAsUser('vendor@bunnies.test');
            browser.get('/vendor-portal/addresses');
        }
    });

    it('should show the addresses page', function() {
        expect(element(by.css('h1')).getText()).toBe('Your business addresses');
    });

    it('should have one addresse', function() {
        var addresses = element.all(by.repeater('address in addresses'));
        expect(addresses.count()).toBe(1);
        expect(addresses.get(0).getText()).toContain('Shepherds Bush Road, London, W6, United Kingdom');
    });
});
