describe('Index as a logged out user', function() {
    var first = true;

    beforeEach(function() {
        if (first) {
            first = false;
            logout();
            browser.get('/');
        }
    });

    it('should have a link to login or sign up', function() {
        expect(element.all(by.css('#main-menu li')).first().getText()).toBe('Log in / Sign up');
    });
});
