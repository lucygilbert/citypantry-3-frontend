describe('Meet the vendors', function() {
    var first = true;

    beforeEach(function() {
        if (first) {
            first = false;
            loginAsUser('customer@bunnies.test');
            browser.get('/vendors');
        }
    });

    it('should show all the approved and active vendors, listed alphabetically', function() {
        var vendors = element.all(by.css('li.vendor'));
        expect(vendors.count()).toBe(5);
        expect(vendors.get(0).element(by.css('h2')).getText()).toBe('FLAME MANGAL');
        expect(vendors.get(1).element(by.css('h2')).getText()).toBe('HONG TIN');
        expect(vendors.get(2).element(by.css('h2')).getText()).toBe('KEBAB CENTRE');
        expect(vendors.get(3).element(by.css('h2')).getText()).toBe('ORIENTAL KITCHEN EXPRESS');
        expect(vendors.get(4).element(by.css('h2')).getText()).toBe('SAM\'S');
    });

    it('should link to the individual vendor pages', function() {
        element.all(by.css('li.vendor')).get(0).element(by.css('a')).click();
        expect(browser.getCurrentUrl()).toMatch(/\.dev\/vendor\/[0-9a-f]{24}-[a-z0-9-]+$/);
    });
});
