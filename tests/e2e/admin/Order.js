describe('Admin - order page', function() {
    var gridTestUtils = require('../lib/gridTestUtils.spec.js');
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/orders');
            gridTestUtils.enterFilterInColumn('orders-table', 5, 'Car');
            element.all(by.css('#orders-table a[href^="/admin/order/"]')).first().click();
            browser.driver.wait(function() {
                return browser.driver.getCurrentUrl().then(function(url) {
                    return (/\/admin\/order\/\d+$/.test(url));
                });
            });
            isFirst = false;
        }
    });

    it('should show the "order" page', function() {
        expect(browser.getCurrentUrl()).toMatch(/\/admin\/order\/\d+$/);
        expect(element(by.css('h1')).getText()).toMatch(/^Order \d+$/);
    });

    it('should show the messages sent between the customer and the vendor', function() {
        expect(element.all(by.repeater('message in messages')).count()).toBe(3);
    });
});
