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
        expectSearchResultCount(5);
    });

    it('should be able to filter by package name', function() {
        packageNameFilter.sendKeys('c');
        expectSearchResultCount(3);
        packageNameFilter.sendKeys('aRrO');
        expectSearchResultCount(1);
        packageNameFilter.sendKeys('t');
        expectSearchResultCount(1);
        packageNameFilter.sendKeys('zzz');
        expectSearchResultCount(0);
        packageNameFilter.clear();
        expectSearchResultCount(5);
    });

    it('should change the URL when the search changes', function() {
        packageNameFilter.sendKeys('curry');
        expect(browser.getCurrentUrl()).toContain('?name=curry');
        packageNameFilter.clear();
        packageNameFilter.sendKeys('marsh');
        expect(browser.getCurrentUrl()).toContain('?name=marsh');
        packageNameFilter.clear();
    });

    it('should be able to filter by head count', function() {
        var headCountFilter = element(by.model('search.headCount'));
        var options = headCountFilter.all(by.css('option'));
        var firstOption = options.get(0);

        options.get(4).click();
        expectSearchResultCount(4);
        firstOption.click();

        options.get(5).click();
        expectSearchResultCount(5);
        firstOption.click();

        options.get(10).click();
        expectSearchResultCount(5);
        firstOption.click();

        options.get(11).click();
        expectSearchResultCount(4);
        firstOption.click();

        expectSearchResultCount(5);
    });

    it('should be able to filter by delivery time', function() {
        var timeFilter = element(by.model('search.time'));
        var options = timeFilter.all(by.css('option'));
        var firstOption = options.get(0);

        options.get(4).click();
        expectSearchResultCount(3);
        firstOption.click();

        options.get(12).click();
        expectSearchResultCount(3);
        firstOption.click();

        options.get(40).click();
        expectSearchResultCount(5);
        firstOption.click();

        expectSearchResultCount(5);
    });
});
