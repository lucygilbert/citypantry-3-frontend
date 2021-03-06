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
                expect(browser.getCurrentUrl()).toMatch(/\/admin\/order\/[\da-f]+$/);
                isFirst = false;
            }
        });

        it('should show the "order" page', function() {
            expect(browser.getCurrentUrl()).toMatch(/\/admin\/order\/[\da-f]+$/);
            expect(element(by.css('h1')).getText()).toMatch(/^Order [\da-f]+$/);
        });

        it('should not show the pick-up date field', function() {
            expect(element(by.model('order.pickupDate')).isPresent()).toBe(false);
        });

        it('should show the messages sent between the customer and the vendor', function() {
            expect(element.all(by.repeater('message in messages')).count()).toBe(3);
        });

        it('should load the order details', function() {
            expect(element(by.model('order.requestedDeliveryDate')).getAttribute('value')).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}\:\d{2}\:\d{2}[+-]\d{2}\:\d{2}$/);
            expect(element(by.model('order.customerUser.name')).getAttribute('value')).toBe('Customer');
            expect(element(by.css('a.vendor-link')).getText()).toBe('Hong Tin');
            expect(element.all(by.css('a.package-link')).first().getText()).toBe('Edit');
            expect(element(by.model('headCount')).getAttribute('value')).toBe('4'); // Actually shows 5.
        });

        it('should allow the requested delivery date to be changed', function() {
            element(by.model('order.requestedDeliveryDate')).clear().sendKeys('01/01/2016 12:30');
        });

        it('should be able to save changes', function() {
            element(by.css('main form.admin-form .btn.btn-primary')).click();
            notificationModal.expectIsOpen();
            notificationModal.expectSuccessHeader();
            notificationModal.expectMessage('The order has been edited.');
            notificationModal.dismiss();
        });

        it('should be able to add customer service events', function() {
            var events = element.all(by.repeater('event in order.customerServiceEvents'));
            expect(events.count()).toBe(0);

            element.all(by.css('.add-customer-service-event button')).get(1).click();
            notificationModal.expectIsOpen();
            notificationModal.expectSuccessHeader();
            notificationModal.expectMessage('Customer service event has been recorded.');
            notificationModal.dismiss();
            expect(events.count()).toBe(1);
        });

        it('should be able to refund an order', function() {
            element(by.id('refund_amount')).clear().sendKeys(50);
            element(by.id('refund_reason')).sendKeys('Delivery was 30 mins late.');
            element(by.css('form[name="refundOrderForm"] .btn.btn-primary')).click();
            notificationModal.expectIsOpen();
            notificationModal.expectSuccessHeader();
            notificationModal.expectMessage('Order has been refunded £50.');
            notificationModal.dismiss();
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
                        return (/\/admin\/order\/[\da-f]+$/.test(url));
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
            element(by.css('main form.admin-form .btn.btn-primary')).click();
            notificationModal.expectIsOpen();
            notificationModal.expectSuccessHeader();
            notificationModal.expectMessage('The order has been edited.');
        });
    });
});
