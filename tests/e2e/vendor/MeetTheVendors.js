describe('Meet the vendors', function() {
    var first = true;

    beforeEach(function() {
        if (first) {
            first = false;
            loginAsUser('alice@bunnies.test');
            browser.get('/vendors');
        }
    });

    it('should show the "meet the vendors" page', function() {
        expect(element(by.css('h1')).getText()).toBe('Meet the vendors');
    });

    it('should have three vendors', function() {
        var vendors = element.all(by.css('li.vendor'));
        expect(vendors.count()).toBe(3);
        expect(vendors.first().element(by.tagName('h2')).getText()).toBe('Flame Mangal');
        expect(vendors.get(1).element(by.tagName('h2')).getText()).toBe('Hong Tin');
        expect(vendors.get(2).element(by.tagName('h2')).getText()).toBe('Oriental Kitchen Express');
    });
});
