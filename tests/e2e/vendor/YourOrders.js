describe('Vendor portal - your orders', function() {
    var first = true;

    beforeEach(function() {
        if (first) {
            first = false;
            loginAsUser('vendor@bunnies.test');
            browser.get('/vendor/orders');
        }
    });

    it('should show the orders page', function() {
        expect(element(by.css('h2.cp-heading')).getText()).toBe('YOUR ORDERS');
    });

    it('should have two orders', function() {
        var orders = element.all(by.repeater('order in orders'));
        expect(orders.count()).toBe(2);
        expect(orders.get(0).getText()).toContain('Marshmallows');
        expect(orders.get(1).getText()).toContain('Carrots');
    });

    it('should be able to accept an order', function() {
        var pendingOrder = element.all(by.repeater('order in orders')).get(1);
        expect(pendingOrder.getText()).toContain('Pending vendor approval');

        pendingOrder.element(by.css('.dropdown a.btn')).click();
        pendingOrder.element(by.css('.dropdown-menu a[ng-click]')).click();

        expect(pendingOrder.getText()).toContain('Active');
    });
});
