describe('Team menu', function() {
    var first = true;

    beforeEach(function() {
        if (first) {
            first = false;

            // The team pages should all be visible to unauthenticated users.
            logout();

            browser.get('/team/f1c57004e222222222222222/menu');
        }
    });

    it('should list the company\'s upcoming and recent orders', function() {
        var orders = element.all(by.repeater('order in orders'));
        expect(orders.count()).toBe(4);
    });

    it('should show the date and package details for each order', function() {
        var orders = element.all(by.repeater('order in orders'));
        var firstOrder = orders.get(0);

        var date = firstOrder.element(by.css('h2'));
        expect(date.getText()).toMatch(/^\d+ [a-zA-Z]+ \d{4}, \d{2}:\d{2}$/);

        var packageDetail = firstOrder.element(by.css('cp-package-detail'));
        expect(packageDetail.isDisplayed()).toBe(true);
    });
});
