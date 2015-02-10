describe('Individual vendor page', function() {
    var first = true;

    beforeEach(function() {
        if (first) {
            first = false;
            loginAsUser('customer@bunnies.test');
            browser.get('/vendors');
            element.all(by.css('li.vendor')).get(2).element(by.css('a')).click();
            expect(browser.getCurrentUrl()).toMatch(/\.dev\/vendor\/[0-9a-f]{24}-[a-z0-9-]+$/);
        }
    });

    it('should show the vendor details', function() {
        expect(element(by.css('h3.vendor-name')).getText()).toBe('Oriental Kitchen Express');
        expect(element(by.css('.vendor-contact-details')).getText()).toBe('Olympia, London, W6, United Kingdom');
    });

    it('should show all the active and approved packages', function() {
        expect(element.all(by.repeater('package in packages')).count()).toBe(1);
    });

    it('should link to the individual package pages', function() {
        element.all(by.repeater('package in packages')).get(0).element(by.css('a')).click();

        expect(browser.getCurrentUrl()).toMatch(/\.dev\/package\/\d+-beef-and-mixed-veg-curry$/);
        expect(element(by.css('main h1')).getText()).toBe('Beef and mixed veg curry');
    });
});
