describe('Meet the vendors', function() {
    var first = true;

    beforeEach(function() {
        if (first) {
            first = false;
            loginAsUser('alice@citypantry.com');
            browser.get('/vendors');
        }
    });

    it('should show the "meet the vendors" page', function() {
        expect(element(by.css('h1')).getText()).toBe('Meet the vendors');
    });

    it('should have two vendors', function() {
        var vendors = element.all(by.css('li.vendor'));
        expect(vendors.count()).toBe(2);
        expect(vendors.first().element(by.tagName('h2')).getText()).toBe('Flame Mangal');
        expect(vendors.get(1).element(by.tagName('h2')).getText()).toBe('Hong Tin');
    });
});
