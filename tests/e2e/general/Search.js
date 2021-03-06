describe('Search', function() {
    var first = true;

    beforeEach(function() {
        if (first) {
            first = false;
            loginAsUser('customer@bunnies.test');
            browser.get('/search');
        }

    });

    function expectSearchResultCount(count) {
        expect(element.all(by.repeater('package in packages')).count()).toBe(count);
    }

    it('should show all packages if there are no search parameters', function() {
        expectSearchResultCount(7);
    });

    it('should toggle the advanced search open and closed when the toggle button is clicked', function() {
        var advancedSearchToggle = element(by.css('.cp-search-advanced-search'));
        var advancedSearchForm = element(by.css('.cp-search-form-advanced'));

        expect(advancedSearchForm.isDisplayed()).toBe(false);
        advancedSearchToggle.click();
        expect(advancedSearchForm.isDisplayed()).toBe(true);
        advancedSearchToggle.click();
        expect(advancedSearchForm.isDisplayed()).toBe(false);

        // Leave advanced search open so later tests can use the advanced search filters.
        advancedSearchToggle.click();
        expect(advancedSearchForm.isDisplayed()).toBe(true);
    });

    it('should be able to filter by delivery date', function() {
        var dateFilter = element(by.model('pickedDate'));
        var now = new Date();
        var nextSunday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (7 - now.getDay()));

        dateFilter.sendKeys(nextSunday.toISOString());
        expectSearchResultCount(2);

        dateFilter.clear();
        expectSearchResultCount(7);
    });

    it('should be able to filter by package name', function() {
        var nameFilter = element(by.model('search.name'));

        nameFilter.sendKeys('Carrots');
        expectSearchResultCount(1);

        nameFilter.clear();
    });

    it('should be able to filter by vendor name', function() {
        var nameFilter = element(by.model('search.name'));

        nameFilter.sendKeys('Oriental Kitchen Express');
        expectSearchResultCount(1);

        nameFilter.clear();
    });

    it('should be able to filter by delivery time', function() {
        var timeFilter = element(by.model('search.time'));
        var options = timeFilter.all(by.css('option'));
        var firstOption = options.get(0); // "-"

        element(by.cssContainingText('option', '07:00')).click();
        expectSearchResultCount(7);
        firstOption.click();

        element(by.cssContainingText('option', '20:30')).click();
        expectSearchResultCount(5);
        firstOption.click();

        expectSearchResultCount(7);
    });

    it('should be able to filter by head count', function() {
        var headCountFilter = element(by.model('search.headCount'));
        var options = headCountFilter.all(by.css('option'));
        var firstOption = options.get(0);

        options.get(4).click();
        expectSearchResultCount(6);
        firstOption.click();

        options.get(5).click();
        expectSearchResultCount(7);
        firstOption.click();

        options.get(10).click();
        expectSearchResultCount(7);
        firstOption.click();

        options.get(11).click();
        expectSearchResultCount(6);
        firstOption.click();

        expectSearchResultCount(7);
    });

    it('should be able to filter by postcode', function() {
        var postcodeFilter = element(by.model('search.postcode'));

        postcodeFilter.sendKeys('W12').sendKeys(protractor.Key.ENTER);
        expectSearchResultCount(1);
        postcodeFilter.sendKeys(' 8LB').sendKeys(protractor.Key.ENTER);
        expectSearchResultCount(1);
        postcodeFilter.clear().sendKeys(protractor.Key.ENTER);
        expectSearchResultCount(7);
    });

    it('should be able to filter by event type', function() {
        var eventTypes = element.all(by.repeater('eventType in eventTypes'));
        expect(eventTypes.get(0).getText()).toBe('Breakfast');
        expect(eventTypes.get(1).getText()).toBe('Lunch');

        eventTypes.get(0).click();
        expectSearchResultCount(1);

        eventTypes.get(0).click();
        expectSearchResultCount(7);
    });

    it('should be able to filter by cuisine type', function() {
        var cuisineTypes = element.all(by.repeater('cuisineType in cuisineTypes'));
        expect(cuisineTypes.get(0).getText()).toBe('British');
        expect(cuisineTypes.get(1).getText()).toBe('Japanese');

        cuisineTypes.get(0).click();
        expectSearchResultCount(1);

        cuisineTypes.get(1).click();
        expectSearchResultCount(3);

        cuisineTypes.get(2).click();
        cuisineTypes.get(3).click();
        expectSearchResultCount(7);
    });

    it('should be able to filter by dietary requirement', function() {
        var dietaryRequirements = element.all(by.repeater('dietaryRequirement in dietaryRequirements'));
        expect(dietaryRequirements.get(0).getText()).toBe('Vegetarian');
        expect(dietaryRequirements.get(1).getText()).toBe('Vegan');

        dietaryRequirements.get(0).click();
        expectSearchResultCount(2);

        dietaryRequirements.get(1).click();
        expectSearchResultCount(2);

        dietaryRequirements.get(0).click();
        dietaryRequirements.get(1).click();
        expectSearchResultCount(7);
    });
});
