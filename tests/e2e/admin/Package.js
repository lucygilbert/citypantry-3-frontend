var notificationModal = require('../NotificationModal.js');
var gridTestUtils = require('../lib/gridTestUtils.spec.js');

describe('Admin - package page - Carrots', function() {
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/packages');
            gridTestUtils.enterFilterInColumn('packages-table', 1, 'Carrots');
            element.all(by.css('#packages-table a[href^="/admin/package/"]')).first().click();
            expect(browser.getCurrentUrl()).toMatch(/\/admin\/package\/[\da-f]+$/);
            isFirst = false;
        }
    });

    it('should show the "package" page', function() {
        expect(browser.getCurrentUrl()).toMatch(/\/admin\/package\/[\da-f]+$/);
        expect(element(by.css('h1')).getText()).toMatch(/^Package \d+$/);
    });

    it('should load the package details', function() {
        expect(element(by.model('vendorPackage.name')).getAttribute('value')).toBe('Carrots');
        expect(element(by.model('vendorPackage.description')).getAttribute('value')).toBe('Yum');
    });

    it('should say the package is visible to all customers', function() {
        expect(element(by.css('.visiblity-description')).getText()).toBe('This package is visible to all customers.');
    });

    it('should be able to save changes', function() {
        element(by.model('vendorPackage.name')).sendKeys(' (orange)');
        element(by.css('main form .btn.btn-primary')).click();
        notificationModal.expectIsOpen();
        notificationModal.expectSuccessHeader();
        notificationModal.expectMessage('The package has been edited.');
    });
});

describe('Admin - package page - Golden Apples', function() {
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/packages');
            gridTestUtils.enterFilterInColumn('packages-table', 1, 'Golden Apples');
            element.all(by.css('#packages-table a[href^="/admin/package/"]')).first().click();
            expect(browser.getCurrentUrl()).toMatch(/\/admin\/package\/[\da-f]+$/);
            isFirst = false;
        }
    });

    it('should say the package is visible to only Apple', function() {
        expect(element(by.css('.visiblity-description')).getText()).toBe('This package is only visible to Apple.');
    });
});

describe('Admin - package page - Unapproved Package', function() {
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/packages');
            gridTestUtils.enterFilterInColumn('packages-table', 1, 'Unapproved Package');
            element.all(by.css('#packages-table a[href^="/admin/package/"]')).first().click();
            expect(browser.getCurrentUrl()).toMatch(/\/admin\/package\/[\da-f]+$/);
            isFirst = false;
        }
    });

    it('should say the package is not visible to customers', function() {
        expect(element(by.css('.visiblity-description')).getText()).toBe('This package is not visible to customers.');
    });
});
