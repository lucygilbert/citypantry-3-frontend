describe('Admin - order page', function() {
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/orders');
            element.all(by.css('#orders-table a[href^="/admin/order/"]')).first().click();
            browser.driver.wait(function() {
                return browser.driver.getCurrentUrl().then(function(url) {
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
});
