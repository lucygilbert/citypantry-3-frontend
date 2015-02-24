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
    });

    it('should be able to save changes', function() {
        element(by.model('vendor.vatRegistered')).sendKeys(false);
        element(by.css('main form .btn.btn-primary')).click();
        // @todo – show notification (24/02).
    });
});
