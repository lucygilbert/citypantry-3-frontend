describe('Admin - customer page', function() {
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/customers');
            element.all(by.css('#customers-table a[href^="/admin/customer/"]')).first().click();
            browser.wait(function() {
                return browser.getCurrentUrl().then(function(url) {
                    return (/\/admin\/customer\/[\da-f]+$/.test(url));
                });
            });
            isFirst = false;
        }
    });

    it('should show the "customer" page', function() {
        expect(browser.getCurrentUrl()).toMatch(/\/admin\/customer\/[\da-f]+$/);
        expect(element(by.css('h1')).getText()).toMatch(/^Customer [\da-f]+/);
    });

    it('should load and display the customer details', function() {
        expect(element(by.css('main')).getText()).toMatch(/Is paid on account\? (Yes|No)/);
        expect(element(by.css('main')).getText()).toMatch(/Customer since: \d{2}\/\d{2}\/\d{4}/);
        expect(element(by.css('main')).getText()).toMatch(/Email: [a-z0-9@\.]+/);
        expect(element(by.css('main')).getText()).toMatch(/User group: [a-zA-Z ]+/);
    });
});
