var gridTestUtils = require('../lib/gridTestUtils.spec.js');

describe('Admin - edit vendor page', function() {
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/vendors');
            gridTestUtils.enterFilterInColumn('vendors-table', 1, 'Hong Tin');
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
        expect(browser.getCurrentUrl()).toMatch(/\/admin\/vendor\/[\da-f]{24}$/);
        expect(element(by.css('h1')).getText()).toMatch(/^Vendor \d+$/);
    });

    it('should show the vendor\'s addresses', function() {
        expect(element.all(by.repeater('address in vendor.addresses')).count()).toBe(1);
    });
});
