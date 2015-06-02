describe('Customer orders', function() {
    var first = true;

    beforeEach(function() {
        if (first) {
            first = false;
            loginAsUser('customer@bunnies.test');
            browser.get('/customer/orders');
        }
    });

    it('should show the orders page', function() {
        expect(element(by.css('h2.cp-heading')).getText()).toBe('YOUR ORDERS');
    });

    it('should have 4 orders', function() {
        var orders = element.all(by.repeater('order in orders'));
        expect(orders.count()).toBe(4);
    });

    it('should be sorted with the most-forward delivery date first', function() {
        var orders = element.all(by.repeater('order in orders'));
        expect(orders.get(0).getText()).toContain('Paella');
        expect(orders.get(1).getText()).toContain('Carrots');
        expect(orders.get(2).getText()).toContain('Marshmallows');
        expect(orders.get(3).getText()).toContain('Beef and mixed veg curry');
    });
});
