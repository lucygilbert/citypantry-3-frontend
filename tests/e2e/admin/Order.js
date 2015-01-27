describe('Admin - order page', function() {
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/order/1');
            isFirst = false;
        }
    });

    it('should show the "order" page', function() {
        expect(element(by.css('h1')).getText()).toBe('Order 1');
    });
});
