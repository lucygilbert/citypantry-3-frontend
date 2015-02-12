describe('Package page', function() {
    describe('Carrots package', function() {
        it('has the package', function() {
            loginAsUser('customer@bunnies.test');
            browser.get('/search');
            element(by.model('bannerSearchName')).sendKeys('Carrots');
            element.all(by.repeater('package in packages')).get(0).all(by.css('a')).get(0).click();
        });

        it('should show the package title', function() {
            expect(element(by.css('main h1')).getText()).toBe('Carrots');
        });

        it('should show the reviews', function() {
            expect(element.all(by.repeater('review in reviews')).count()).toBe(2);
        });
    });
});
