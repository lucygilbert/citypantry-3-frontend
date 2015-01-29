describe('Admin - customer page', function() {
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/customers');
            element.all(by.css('#customers-table a[href^="/admin/customer/"]')).first().click();
            browser.driver.wait(function() {
                return browser.driver.getCurrentUrl().then(function(url) {
                    return (/\/admin\/customer\/\d+$/.test(url));
                });
            });
            isFirst = false;
        }
    });

    it('should show the "customer" page', function() {
        expect(browser.getCurrentUrl()).toMatch(/\/admin\/customer\/\d+$/);
        expect(element(by.css('h1')).getText()).toMatch(/^Customer \d+$/);
    });
});
