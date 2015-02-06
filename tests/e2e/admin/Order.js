describe('Admin - order page', function() {
    var gridTestUtils = require('../lib/gridTestUtils.spec.js');
    var notificationModal = require('../NotificationModal.js');

    describe('editing a non-courier order', function() {
        var isFirst = true;

        beforeEach(function() {
            if (isFirst) {
                loginAsUser('alice@bunnies.test');
                browser.get('/admin/orders');
                gridTestUtils.enterFilterInColumn('orders-table', 5, 'Car');
                element.all(by.css('#orders-table a[href^="/admin/order/"]')).first().click();
                browser.wait(function() {
                    return browser.getCurrentUrl().then(function(url) {
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

        it('should not show the pick-up date field', function() {
            expect(element(by.model('order.pickupDate')).isPresent()).toBe(false);
        });

        it('should show the messages sent between the customer and the vendor', function() {
            expect(element.all(by.repeater('message in messages')).count()).toBe(3);
        });

        it('should load the order details', function() {
            expect(element(by.model('order.requestedDeliveryDate')).getAttribute('value')).toMatch(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/);
            expect(element(by.model('order.customerUser.name')).getAttribute('value')).toBe('Customer');
            expect(element(by.model('order.package.vendor.name')).getAttribute('value')).toBe('Hong Tin');
            expect(element(by.model('order.package.name')).getAttribute('value')).toBe('Carrots');
            expect(element(by.model('headCount')).getAttribute('value')).toBe('4'); // Actually shows 5.
            expect(element(by.model('vegetarianHeadCount')).getAttribute('value')).toBe('0');
        });

        it('should allow the requested delivery date to be changed', function() {
            element(by.model('order.requestedDeliveryDate')).clear().sendKeys('01/01/2016 12:30');
        });

        it('should update the options for vegetarian head count when head count is changed', function() {
            var options = element.all(by.css('#vegetarian_head_count > option'));
            expect(options.count()).toBe(6); // 6 because 5 options + zero option = 6.
            element(by.model('headCount')).sendKeys('11');
            expect(options.count()).toBe(12); // 12 because 11 options + zero option = 12.
        });

        it('should be able to save changes', function() {
            element(by.css('main form .btn.btn-primary')).click();
            notificationModal.expectIsOpen();
            notificationModal.expectSuccessHeader();
            notificationModal.expectMessage('The order has been edited.');
        });
    });

    describe('editing a courier order', function() {
        var isFirst = true;

        beforeEach(function() {
            if (isFirst) {
                loginAsUser('alice@bunnies.test');
                browser.get('/admin/orders');
                gridTestUtils.enterFilterInColumn('orders-table', 5, 'Beef');
                element.all(by.css('#orders-table a[href^="/admin/order/"]')).first().click();
                browser.wait(function() {
                    return browser.getCurrentUrl().then(function(url) {
                        return (/\/admin\/order\/\d+$/.test(url));
                    });
                });
                isFirst = false;
            }
        });

        it('should show the pick-up date field', function() {
            expect(element(by.model('order.pickupDate')).isDisplayed()).toBe(true);
        });

        it('should allow the pickup date to be changed', function() {
            element(by.model('order.pickupDate')).clear().sendKeys('01/01/2016 12:10');
        });

        it('should be able to save changes', function() {
            element(by.css('main form .btn.btn-primary')).click();
            notificationModal.expectIsOpen();
            notificationModal.expectSuccessHeader();
            notificationModal.expectMessage('The order has been edited.');
        });
    });
});