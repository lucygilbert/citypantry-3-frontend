describe('Admin - edit order delivery status page', function() {
    var gridTestUtils = require('../lib/gridTestUtils.spec.js');
    var notificationModal = require('../NotificationModal.js');
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/orders');
            gridTestUtils.enterFilterInColumn('orders-table', 8, 'Unknown');
            element.all(by.css('#orders-table a[href^="/admin/order/"]')).first().click();
            expect(browser.getCurrentUrl()).toMatch(/\/admin\/order\/[\da-f]{24}$/);
            element(by.css('a.cp-edit-delivery-status')).click();
            expect(browser.getCurrentUrl()).toMatch(/\/admin\/order\/[\da-f]{24}\/delivery-status$/);
            isFirst = false;
        }
    });

    it('should show the current delivery status', function() {
        expect(element(by.css('p.cp-current-delivery-status')).getText())
            .toBe('Current delivery status: Unknown');
    });

    it('should show all available delivery status options', function() {
        var options = element.all(by.css('select option'));
        expect(options.count()).toBe(5); // 4 real options + 1 empty option.
    });

    it('should be able to complete the form', function() {
        element.all(by.css('select option')).get(2).click();
        element(by.model('update.reasonForNotUsingTheSmsSystem')).sendKeys('Because.');
        element(by.model('update.reasonForNotUsingTheMobileApp')).sendKeys('Because.');
        element(by.model('update.reasonForNotUsingTheMobileWebsite')).sendKeys('Because.');
        element(by.model('update.minutesSpent')).sendKeys(6);
    });

    it('should be able to save the form', function() {
        element(by.css('form input[type="submit"]')).click();

        notificationModal.expectIsOpen();
        notificationModal.expectSuccessHeader();
        notificationModal.expectMessage('The delivery status has been updated.');
        notificationModal.dismiss();
    });

    it('should have been redirected back to the edit order page, which now shows the new delivery status', function() {
        expect(browser.getCurrentUrl()).toMatch(/\/admin\/order\/[\da-f]{24}$/);

        expect(element(by.id('order_delivery_status')).getAttribute('value')).toBe('Late < 15 mins');
    });
});
