describe('About', function() {
    var first = true;

    beforeEach(function() {
        if (first) {
            first = false;
            browser.get('/about');
        }
    });

    it('should show the "about" page', function() {
        expect(element(by.css('h1')).getText()).toBe('About City Pantry');
    });

    it('should highlight the "about" link in the sidebar', function() {
        var activeLinks = element.all(by.css('.sidebar-menu li.active'));
        expect(activeLinks.count()).toBe(1);
        expect(activeLinks.first().getText()).toBe('About');
    });
});
