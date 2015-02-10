var notificationModal = require('../NotificationModal.js');
var gridTestUtils = require('../lib/gridTestUtils.spec.js');

describe('Admin - package page', function() {
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/packages');
            gridTestUtils.enterFilterInColumn('packages-table', 1, 'Carrots');
            element.all(by.css('#packages-table a[href^="/admin/package/"]')).first().click();
            browser.driver.wait(function() {
                return browser.driver.getCurrentUrl().then(function(url) {
                    return (/\/admin\/package\/[\da-f]+$/.test(url));
                });
            });
            isFirst = false;
        }
    });

    it('should show the "package" page', function() {
        expect(browser.getCurrentUrl()).toMatch(/\/admin\/package\/[\da-f]+$/);
        expect(element(by.css('h1')).getText()).toMatch(/^Package [\da-f]+$/);
    });

    it('should load the package details', function() {
        expect(element(by.model('vendorPackage.name')).getAttribute('value')).toBe('Carrots');
        expect(element(by.model('vendorPackage.description')).getAttribute('value')).toBe('Yum');
    });

    it('should be able to save changes', function() {
        element(by.model('vendorPackage.name')).sendKeys(' (orange)');
        element(by.css('main form .btn.btn-primary')).click();
        notificationModal.expectIsOpen();
        notificationModal.expectSuccessHeader();
        notificationModal.expectMessage('The package has been edited.');
    });
});
