describe('Admin - vendor page', function() {
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/vendors');
            element.all(by.css('#vendors-table a[href^="/admin/vendor/"]')).first().click();
            browser.driver.wait(function() {
                return browser.driver.getCurrentUrl().then(function(url) {
                    return (/\/admin\/vendor\/[\da-f]+$/.test(url));
                });
            });
            isFirst = false;
        }
    });

    it('should show the "vendor" page', function() {
        expect(browser.getCurrentUrl()).toMatch(/\/admin\/vendor\/[\da-f]+$/);
        expect(element(by.css('h1')).getText()).toMatch(/^Vendor [\da-f]+$/);
    });
});
