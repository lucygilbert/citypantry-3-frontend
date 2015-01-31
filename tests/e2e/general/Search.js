describe('Search', function() {
    var first = true;
    var packageNameFilter;

    beforeEach(function() {
        if (first) {
            first = false;
            loginAsUser('customer@bunnies.test');
            browser.get('/search');
        }

        packageNameFilter = element(by.model('bannerSearchName'));
    });

    function expectSearchResultCount(count) {
        expect(element(by.css('h1')).getText()).toContain(count + ' package');
        expect(element.all(by.repeater('package in packages')).count()).toBe(count);
    }

    it('should show all packages if there are no search parameters', function() {
        expectSearchResultCount(4);
    });

    it('should be able to filter by package name', function() {
        packageNameFilter.sendKeys('c');
        expectSearchResultCount(2);
        packageNameFilter.sendKeys('aRrO');
        expectSearchResultCount(1);
        packageNameFilter.sendKeys('t');
        expectSearchResultCount(1);
        packageNameFilter.sendKeys('zzz');
        expectSearchResultCount(0);
    });
});
