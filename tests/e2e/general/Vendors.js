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

    it('should show two vendors, listed alphabetically', function() {
        var vendors = element.all(by.css('li.vendor'));
        expect(vendors.count()).toBe(2);
        expect(vendors.get(0).element(by.css('h2')).getText()).toBe('Flame Mangal');
        expect(vendors.get(1).element(by.css('h2')).getText()).toBe('Hong Tin');
    });
});
