describe('Admin - order page', function() {
    var gridTestUtils = require('../lib/gridTestUtils.spec.js');
    var isFirst = true;
    var notificationModal = require('../NotificationModal.js');

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
    
    it('should load the order details', function() {
        // @todo – expected values.
        expect(element(by.model('order.date')).getAttribute('value')).toBe('');
        expect(element(by.model('headCount')).getAttribute('value')).toBe('');
        expect(element(by.model('vegetarianHeadCount')).getAttribute('value')).toBe('');
    });
    
    it('should convert the date and time to ISO8601', function() {
        element(by.model('order.date')).clear().sendKeys('01/01/2016 12:30');
        expect(element(by.model('order.date')).getAttribute('value')).toBe('2016-01-01T12:30:00+0000');
    });
    
    it('should update the options for vegetarian head count when head count is changed', function() {
        var options = element.all(by.css('#vegetarian_head_count > option'));
        // @todo – expected count.
        expect(options.count()).toBe();
        element(by.model('headCount')).clear().sendKeys('11');
        options = element.all(by.css('#vegetarian_head_count > option'));
        expect(options.count()).toBe(11);
    });
    
    it('should be able to save changes', function() {
        element(by.model('headCount')).clear().sendKeys('11');
        element(by.css('main form .btn.btn-primary')).click();
        notificationModal.expectIsOpen();
        notificationModal.expectSuccessHeader();
        notificationModal.expectMessage('The order has been edited.');
    });
});
