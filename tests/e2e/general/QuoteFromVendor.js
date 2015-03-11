describe('Quote from vendor', function() {
    var first = true;

    beforeEach(function() {
        if (first) {
            first = false;
            loginAsUser('customer@bunnies.test');
            browser.get('/vendors');
            element.all(by.css('li.vendor')).get(0).element(by.css('a')).click();
            element(by.css('a.hire-for-an-event')).click();
        }
    });

    it('should open the quote page', function () {
        expect(browser.getCurrentUrl()).toMatch(/\.dev\/quote\/vendor\/[0-9a-f]{24}/);
    });

    it('should show the name of the vendor', function () {
        expect(element(by.css('main h1')).getText()).toBe('Hire Flame Mangal for an event');
    });

    // A more detailed test for this page, including submitted the form, is
    // in `tests/e2e/general/Quote.js`.
});
