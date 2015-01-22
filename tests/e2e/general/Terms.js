describe('Terms and conditions', function() {
    var first = true;

    beforeEach(function() {
        if (first) {
            first = false;
            browser.get('/terms');
        }
    });

    it('should show the "terms" page', function() {
        expect(element(by.css('h1')).getText()).toBe('Terms and conditions');
    });

    it('should highlight the "terms" link in the sidebar', function() {
        var activeLinks = element.all(by.css('.sidebar-menu li.active'));
        expect(activeLinks.count()).toBe(1);
        expect(activeLinks.first().getText()).toBe('Terms');
    });
});
