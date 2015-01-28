describe('Personal information page', function() {
    var first = true;

    beforeEach(function() {
        if (first) {
            first = false;
            loginAsUser('customer@bunnies.test');
            browser.get('/customer/account');
        }
    });

    it('should show the form with the user\'s personal information filled in', function() {
        expect(element(by.id('name')).getAttribute('value')).toBe('Customer');
        expect(element(by.id('company')).getAttribute('value')).toBe('Aperture Science');
    });

    it('should highlight the "personal information" link in the sidebar', function() {
        var activeLinks = element.all(by.css('.sidebar-menu li.active'));
        expect(activeLinks.count()).toBe(1);
        expect(activeLinks.first().getText()).toBe('Personal information');
    });
});
