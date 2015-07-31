describe('Admin - order stats page', function() {
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/orders/stats');
            isFirst = false;
        }
    });

    it('should have the title "Orders stats"', function() {
        expect(element(by.css('h1')).getText()).toBe('ORDERS STATS');
    });

    it('should have a section for each month', function() {
        expect(element.all(by.css('h3')).count()).toBeGreaterThan(1);
    });
});
