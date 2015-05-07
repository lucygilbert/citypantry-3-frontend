describe('Dashboard page', function() {
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('customer@bunnies.test');
            browser.get('/customer/dashboard');
            isFirst = false;
        }
    });

    it('should show the "Dashboard" page and greet the customer with their first name', function() {
        expect(element(by.css('h1')).getText()).toContain('HELLO CUSTOMER,');
    });

    it('should load event types', function() {
        expect(element.all(by.css('#search_event_type > option')).count()).toBe(7);
        expect(element.all(by.css('#search_event_type > option')).get(1).getText()).toBe('Breakfast');
        expect(element.all(by.css('#search_event_type > option')).get(2).getText()).toBe('Lunch');
    });

    it('should show a date picker when delivery date is focused', function() {
        var datePicker = element(by.model('date'));

        expect(datePicker.isDisplayed()).toBe(false);
        element(by.model('pickedDate')).click();
        expect(datePicker.isDisplayed()).toBe(true);
    });

    // This test will fail if the suite is run in isolation because the address added by
    // CreatePackage will not exist.
    it('should load customer\'s addresses and select first by default', function() {
        expect(element.all(by.css('#search_postcode > option')).count()).toBe(2);
        expect(element.all(by.css('#search_postcode > option')).get(0).getText()).toBe('Lena Gardens');
        expect(element.all(by.css('#search_postcode > option')).get(1).getText()).toBe('11 Francis Street');

        expect(element(by.css('#search_postcode')).$('option:checked').getText()).toBe('Lena Gardens');
    });

    it('should show an error if an invalid postcode is entered', function() {
        element(by.model('search.newPostcode')).sendKeys('QWERTY');
        element(by.css('.cp-dashboard-form input[type="submit"]')).click();

        var error = element.all(by.css('label[for="search_new_postcode"] > .form-element-invalid')).get(0);
        expect(error.getText()).toBe('Postcode is invalid');
        expect(error.isDisplayed()).toBe(true);

        // Revert the changes so other tests will pass.
        element(by.model('search.newPostcode')).clear();
    });

    it('should show customer\'s next order', function() {
        expect(element(by.css('.cp-dashboard-aside')).isPresent()).toBe(true);
        expect(element(by.css('.cp-dashboard-aside-order-date')).getText()).toMatch(/\d{2} \w+ \d{2}/);
        expect(element(by.css('.cp-package-card-name')).getText()).toBe('CARROTS');
        expect(element(by.css('.cp-package-card-vendor')).getText()).toBe('Hong Tin');
        expect(element(by.css('.cp-package-card-price')).getText()).toContain('£20.00');
        expect(element(by.css('.cp-dashboard-aside-package-description')).getText()).toBe('Yum');
    });

    it('should show a notice to call City Pantry if \'Edit\' is clicked', function() {
        var editOrderNotice = element(by.css('.cp-dashboard-aside-order-edit-notice'));
        expect(editOrderNotice.isDisplayed()).toBe(false);

        element(by.css('.cp-dashboard-aside-order-edit')).click();
        expect(editOrderNotice.isDisplayed()).toBe(true);
    });

    it('should be able to search for food', function() {
        var now = new Date();
        var oneWeekFromNow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);

        element(by.model('pickedDate')).sendKeys(oneWeekFromNow.toLocaleDateString());
        element(by.model('search.headCount')).sendKeys(10);

        element(by.css('.cp-dashboard-form input[type="submit"]')).click();

        expect(browser.getCurrentUrl()).toMatch(/citypantry\.dev\/search$/);
    });
});
