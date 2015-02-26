describe('Vendor portal - edit profile', function() {
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('vendor@bunnies.test');
            browser.get('/vendor/profile');
            isFirst = false;
        }
    });

    it('should show the "Edit profile" page', function() {
        expect(element(by.css('h1')).getText()).toBe('Edit profile');
    });

    it('should load the vendor details', function() {
        expect(element(by.model('vendor.description')).getAttribute('value')).toBe('Chinese takeaway in W6');
        expect(element(by.model('vendor.maxPeople')).getAttribute('value')).toBe('32'); // 32 because 45 is the 32nd option.
        expect(element(by.css('[ng-model="vendor.isVatRegisteredString"][value="true"]')).getAttribute('selected')).toBe('true');
        expect(element(by.css('[ng-model="vendor.isVatRegisteredString"][value="false"]')).getAttribute('selected')).not.toBe('true');
        expect(element(by.model('vendor.vatNumber')).getAttribute('value')).toBe('567K');
    });

    it('should hide the VAT number if the vendor is not VAT registered', function() {
        element(by.css('[ng-model="vendor.isVatRegisteredString"][value="false"]')).click();
        expect(element(by.model('vendor.vatNumber')).isPresent()).toBe(false);
    });

    it('should be able to save changes', function() {
        element(by.model('vendor.description')).sendKeys('Test');
        element(by.css('[ng-model="vendor.isVatRegisteredString"][value="false"]')).click();
        element(by.css('main form .btn.btn-primary')).click();
    });
});
