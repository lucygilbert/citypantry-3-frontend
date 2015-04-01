// The filename begins with a 'Z' because we want it to run after the 'CreatePackage' and 'EditPackage'
// tests have run.

describe('Vendor portal - delivery radiuses', function() {
    var notificationModal = require('../NotificationModal.js');
    var isFirst = true;
    var packages;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('vendor@bunnies.test');
            browser.get('/vendor/delivery-radiuses');
            isFirst = false;
        }

        packages = element.all(by.repeater('package in packages'));
    });

    it('should load the "Delivery radiuses" page', function() {
        expect(element(by.css('h2.cp-heading')).getText()).toBe('YOUR PACKAGE’S DELIVERY RADIUSES');
    });

    it('should list all the packages, sorted alphabetically', function() {
        expect(packages.count()).toBe(3);
        expect(packages.get(0).getText()).toContain('Carrots');
        expect(packages.get(1).getText()).toContain('Fish cake');
        expect(packages.get(2).getText()).toContain('Marshmallows');
    });

    it('should list all the addresses under each package', function() {
        for (var i = 0; i < 3; i++) {
            expect(packages.get(i).all(by.repeater('address in addresses')).count()).toBe(4);
        }

        expect(packages.get(0).all(by.repeater('address in addresses')).get(0).getText()).toContain('Shepherds Bush Road, London, W6');
    });

    it('should display the delivery radius if one is set for an address', function() {
        expect(packages.get(0).all(by.css('input')).get(2).getAttribute('value')).toBe('2');
    });

    it('should show an empty input when no delivery radius is set for an address', function() {
        expect(packages.get(0).all(by.css('input')).get(0).getAttribute('value')).toBe('');
    });

    it('should allow a delivery radius to be set', function() {
        packages.get(0).all(by.css('input')).get(0).clear().sendKeys('5.33');

        element(by.css('main input[type="submit"]')).click();

        notificationModal.expectIsOpen();
        notificationModal.expectSuccessHeader();
        notificationModal.expectMessage('Your delivery radiuses have been saved.');
        notificationModal.dismiss();
    });

    it('should show an error if a delivery radius is set to a number less than 1', function() {
        packages.get(0).all(by.css('input')).get(0).clear().sendKeys('0.9');

        element(by.css('main input[type="submit"]')).click();

        notificationModal.expectIsOpen();
        notificationModal.expectErrorHeader();
        notificationModal.expectMessage('The minimum delivery radius for a package is 1 mile');
        notificationModal.dismiss();
    });
});
