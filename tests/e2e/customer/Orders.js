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
        expect(element(by.css('h1')).getText()).toBe('Your orders');
    });

    it('should have two orders', function() {
        var orders = element.all(by.repeater('order in orders'));
        expect(orders.count()).toBe(2);
        expect(orders.get(0).getText()).toContain('Marshmallows');
        expect(orders.get(1).getText()).toContain('Carrots');
    });
});
