describe('Privacy policy', function() {
    var first = true;

    beforeEach(function() {
        if (first) {
            first = false;
            browser.get('/privacy');
        }
    });

    it('should show the "privacy policy" page', function() {
        expect(element(by.css('h1')).getText()).toBe('Privacy policy');
    });

    it('should highlight the "privacy policy" link in the sidebar', function() {
        var activeLinks = element.all(by.css('.sidebar-menu li.active'));
        expect(activeLinks.count()).toBe(1);
        expect(activeLinks.first().getText()).toBe('Privacy');
    });
});
