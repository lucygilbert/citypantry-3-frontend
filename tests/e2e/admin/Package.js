describe('Admin - package page', function() {
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/packages');
            element.all(by.css('#packages-table a[href^="/admin/package/"]')).first().click();
            browser.driver.wait(function() {
                return browser.driver.getCurrentUrl().then(function(url) {
                    return (/\/admin\/package\/\d+$/.test(url));
                });
            });
            isFirst = false;
        }
    });

    it('should show the "package" page', function() {
        expect(browser.getCurrentUrl()).toMatch(/\/admin\/package\/\d+$/);
        expect(element(by.css('h1')).getText()).toMatch(/^Package \d+$/);
    });

    it('should load the package details', function() {
        expect(element(by.model('vendorPackage.name')).getAttribute('value')).toBe('Carrots');
        expect(element(by.model('vendorPackage.description')).getAttribute('value')).toBe('Yum');
    });

    // @todo - once we have an HTML-based NotificationService, extend these tests to click save
    // and assert that a success message is shown.
});
