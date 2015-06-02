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
    });

    it('should list the orders with the most-forward first', function() {
        var orders = element.all(by.repeater('order in orders'));
        expect(orders.get(0).getText()).toContain('Carrots');
        expect(orders.get(1).getText()).toContain('Marshmallows');
    });

    it('should be able to accept an order', function() {
        var pendingOrder = element.all(by.repeater('order in orders')).get(0);
        expect(pendingOrder.getText()).toContain('Pending vendor approval');

        var acceptLink = pendingOrder.element(by.css('a.accept-order'));
        expect(acceptLink.getText()).toBe('Accept order');
        acceptLink.click();

        expect(pendingOrder.getText()).toContain('Active');
    });
});
