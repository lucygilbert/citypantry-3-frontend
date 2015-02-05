describe('Meet the vendor', function() {
    var first = true;

    beforeEach(function() {
        if (first) {
            first = false;
            loginAsUser('customer@bunnies.test');
            browser.get('/vendors');
        }
    });

    it('should show the "Meet the vendors" page', function() {
        expect(element(by.css('h1')).getText()).toBe('Meet the vendors');
    });

    it('should show all the approved and active vendors, listed alphabetically', function() {
        var vendors = element.all(by.css('li.vendor'));
        expect(vendors.count()).toBe(3);
        expect(vendors.get(0).element(by.css('h2')).getText()).toBe('Flame Mangal');
        expect(vendors.get(1).element(by.css('h2')).getText()).toBe('Hong Tin');
        expect(vendors.get(2).element(by.css('h2')).getText()).toBe('Oriental Kitchen Express');
    });

    it('should link to the individual vendor pages', function() {
        element.all(by.css('li.vendor')).get(0).element(by.css('a')).click();
        expect(browser.getCurrentUrl()).toMatch(/\.dev\/vendor\/[0-9]+-[a-z0-9-]+$/);
    });
});
