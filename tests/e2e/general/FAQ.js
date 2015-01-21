describe('FAQ', function() {
    var first = true;

    beforeEach(function() {
        if (first) {
            first = false;
            browser.get('/faq');
        }
    });

    it('should show the FAQ page', function() {
        expect(element(by.css('h1')).getText()).toBe('Frequently asked questions');
    });

    it('should highlight the FAQ link in the sidebar', function() {
        var activeLinks = element.all(by.css('.sidebar-menu li.active'));
        expect(activeLinks.count()).toBe(1);
        expect(activeLinks.first().getText()).toBe('FAQ');
    });
});
