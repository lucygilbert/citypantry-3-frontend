describe('Services pages', function() {
    var first = true;

    beforeEach(function() {
        if (first) {
            first = false;

        }
    });

    function expectOneActiveSidebarLinkWithText(text) {
        var activeLinks = element.all(by.css('.sidebar-menu li.active'));
        expect(activeLinks.count()).toBe(1);
        expect(activeLinks.first().getText()).toBe(text);
    }

    it('should have an "event catering" page', function() {
        browser.get('/event-catering');
        expect(element(by.css('h1')).getText()).toBe('Event catering');
        expectOneActiveSidebarLinkWithText('Event catering');
    });

    it('should have an "team lunch" page', function() {
        browser.get('/team-lunch');
        expect(element(by.css('h1')).getText()).toBe('Team/Employee lunch');
        expectOneActiveSidebarLinkWithText('Team lunch');
    });

    it('should have an "event catering" page', function() {
        browser.get('/office-managers');
        expect(element(by.css('h1')).getText()).toBe('Office managers');
        expectOneActiveSidebarLinkWithText('For office managers');
    });
});
