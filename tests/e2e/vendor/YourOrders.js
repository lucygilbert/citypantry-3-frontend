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
        expect(element(by.css('h1')).getText()).toBe('Your orders');
    });

    it('should have two orders', function() {
        var orders = element.all(by.repeater('order in orders'));
        expect(orders.count()).toBe(2);
        expect(orders.get(0).getText()).toContain('Carrots');
        expect(orders.get(1).getText()).toContain('Marshmallows');
    });
});
