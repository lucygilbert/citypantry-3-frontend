describe('Index as a logged in user', function() {
    it('should show admin users the admin navigation', function() {
        loginAsUser('alice@bunnies.test');

        var links = element.all(by.css('#main-menu > ul > li'));
        expect(links.get(0).getText()).toContain('My account');
        expect(links.get(1).getText()).toBe('Orders');
        expect(links.get(2).getText()).toBe('Courier');
        expect(links.count()).toBe(7);
    });
});
