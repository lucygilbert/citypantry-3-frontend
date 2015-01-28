describe('Password page', function() {
    var first = true;

    beforeEach(function() {
        if (first) {
            first = false;
            loginAsUser('customer@bunnies.test');
            browser.get('/customer/password');
        }
    });

    it('should show the form', function() {
        expect(element.all(by.css('main input[type="password"]')).count()).toBe(3);
    });

    it('should highlight the "password" link in the sidebar', function() {
        var activeLinks = element.all(by.css('.sidebar-menu li.active'));
        expect(activeLinks.count()).toBe(1);
        expect(activeLinks.first().getText()).toBe('Password');
    });
});
