describe('Vendor portal - create package', function() {
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('vendor@bunnies.test');
            browser.get('/vendor/packages');
            element.all(by.css('#table_packages a[href^="/vendor/packages/"]')).first().click();
            browser.driver.wait(function() {
                return browser.driver.getCurrentUrl().then(function(url) {
                    return (/\/vendor\/packages\/[\da-f]+$/.test(url));
                });
            });
            isFirst = false;
        }
    });

    it('should show the "Edit package" page', function() {
        expect(browser.getCurrentUrl()).toMatch(/\/vendor\/packages\/[\da-f]+$/);
        expect(element(by.css('h1')).getText()).toBe('Edit package');
    });

    it('should load the package details', function() {
        expect(element(by.model('package.name')).getAttribute('value')).toBe('Carrots');
        expect(element(by.model('package.description')).getAttribute('value')).toBe('Yum');
        expect(element(by.model('package.hotFood')).getAttribute('value')).toBe(false);
        expect(element(by.model('package.cost')).getAttribute('value')).toBe(20);
        // @todo – test for cuisine type, dietary type(s), allergen type(s), event type(s) and
        // delivery day(s).
    });

    it('should show the vendor’s addresses', function() {
        expect(element.all(by.repeater('vendorAddress in vendor.addresses')).count()).toBe(1);
    });

    it('should be able to save changes', function() {
        element(by.model('package.name')).clear().sendKeys('Cabbage');
        element(by.css('main form input.btn.btn-primary')).click();

        // Should redirect to the packages page.
        expect(browser.getCurrentUrl()).toMatch(/citypantry\.dev\/vendor\/packages$/);
    });
});
