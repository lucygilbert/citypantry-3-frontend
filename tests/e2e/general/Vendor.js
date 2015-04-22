describe('Individual vendor page - as Aperture Science', function() {
    var first = true;
    var packages;

    beforeEach(function() {
        if (first) {
            first = false;
            loginAsUser('customer@bunnies.test');
            browser.get('/vendors');
            element.all(by.css('li.vendor')).get(3).element(by.css('a')).click();
            expect(browser.getCurrentUrl()).toMatch(/\.dev\/vendor\/[0-9a-f]{24}-oriental-kitchen-express$/);
        }

        packages = element.all(by.repeater('package in packages'));
    });

    it('should show the vendor details', function() {
        expect(element(by.css('.cp-vendor-card-name')).getText()).toBe('ORIENTAL KITCHEN EXPRESS');
        expect(element(by.css('.cp-vendor-card-address')).getText()).toBe('Olympia, London, W6, United Kingdom');
    });

    it('should show all the active and approved packages', function() {
        expect(packages.count()).toBe(1);
        expect(packages.get(0).getText()).toContain('BEEF AND MIXED VEG CURRY');

        // 'Golden Apples' should not be displayed because it is only for the customer Apple.
    });

    it('should link to the individual package pages', function() {
        packages.get(0).element(by.css('a')).click();

        expect(browser.getCurrentUrl()).toMatch(/\.dev\/package\/\d+-beef-and-mixed-veg-curry$/);
        expect(element(by.css('main h1')).getText()).toBe('BEEF AND MIXED VEG CURRY');
    });
});

describe('Individual vendor page - as Apple', function() {
    var first = true;

    beforeEach(function() {
        if (first) {
            first = false;
            loginAsUser('customer@apple.test');
            browser.get('/vendors');
            element.all(by.css('li.vendor')).get(3).element(by.css('a')).click();
            expect(browser.getCurrentUrl()).toMatch(/\.dev\/vendor\/[0-9a-f]{24}-oriental-kitchen-express$/);
        }
    });

    it('should show all the active and approved packages', function() {
        var packages = element.all(by.repeater('package in packages'));
        expect(packages.count()).toBe(2);
        expect(packages.get(0).getText()).toContain('BEEF AND MIXED VEG CURRY');

        // 'Golden Apples' should be displayed because it is only for the customer Apple.
        expect(packages.get(1).getText()).toContain('GOLDEN APPLES');
    });
});
