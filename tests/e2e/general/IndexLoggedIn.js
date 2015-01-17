describe('Index as a logged in user', function() {
    var first = true;

    beforeEach(function() {
        if (first) {
            first = false;
            loginAsUser('alice@bunnies.test');
            browser.get('/');
        }
    });

    it('should have the logged in navigation', function() {
        expect(element.all(by.css('#main-menu')).first().getText()).toContain('@todo - logged in nav');
    });
});
