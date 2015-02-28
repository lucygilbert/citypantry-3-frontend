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

    it('should be able to filter by event type', function() {
        var eventTypes = element.all(by.repeater('eventType in eventTypes'));
        expect(eventTypes.get(0).getText()).toBe('Breakfast');
        expect(eventTypes.get(1).getText()).toBe('Christmas');

        eventTypes.get(0).click();
        expectSearchResultCount(1);

        var clearFilter = element(by.css('.event-type-filter-selected button'));
        clearFilter.click();
        expectSearchResultCount(5);
    });

    it('should be able to filter by cuisine type', function() {
        var cuisineTypes = element.all(by.repeater('cuisineType in cuisineTypes'));
        expect(cuisineTypes.get(0).getText()).toBe('Asian');
        expect(cuisineTypes.get(1).getText()).toBe('British');
        expect(cuisineTypes.get(2).getText()).toBe('European');

        cuisineTypes.get(0).click();
        expectSearchResultCount(2);

        var clearFilter = element(by.css('.cuisine-type-filter-selected button'));
        clearFilter.click();
        expectSearchResultCount(5);
    });

    it('should sort packages from highest price to lowest', function () {
        element(by.cssContainingText('option', 'Price: high to low')).click();

        var packages = element.all(by.repeater('package in packages'));
        expect(packages.first().getText()).toContain('Carrots');
        expect(packages.last().getText()).toContain('Marshmallows');
    });

    it('should sort packages from lowest price to highest', function () {
        element(by.cssContainingText('option', 'Price: low to high')).click();

        var packages = element.all(by.repeater('package in packages'));
        expect(packages.first().getText()).toContain('Marshmallows');
        expect(packages.last().getText()).toContain('Carrots');
    });
});
