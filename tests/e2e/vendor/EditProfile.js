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
        expect(element(by.css('h2.cp-heading')).getText()).toBe('EDIT PROFILE');
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

        element(by.css('[ng-model="vendor.isVatRegisteredString"][value="true"]')).click();
        expect(element(by.model('vendor.vatNumber')).isPresent()).toBe(true);
    });

    it('should be able to save changes', function() {
        element(by.model('vendor.description')).sendKeys('Test');
        element(by.css('[ng-model="vendor.isVatRegisteredString"][value="false"]')).click();
        element(by.css('main form .btn.btn-primary')).click();
    });

    it('should revert the changes so that future tests don\'t fail', function() {
        element(by.model('vendor.description')).clear().sendKeys('Hong Tin');
        element(by.css('[ng-model="vendor.isVatRegisteredString"][value="true"]')).click();
        element(by.css('main form .btn.btn-primary')).click();
    });
});
