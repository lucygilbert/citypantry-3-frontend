describe('Vendor portal - holidays', function() {
    var notificationModal = require('../NotificationModal.js');
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('vendor@bunnies.test');
            browser.get('/vendor/holidays');
            isFirst = false;
        }
    });

    it('should load the holidays page', function() {
        expect(element(by.css('h2.cp-heading')).getText()).toBe('YOUR HOLIDAYS');
    });

    it('should list all the holidays', function() {
        var holidays = element.all(by.repeater('holiday in holidays'));
        expect(holidays.count()).toBe(2);
        expect(holidays.get(0).getText()).toContain('From 2 Feb 2014 until 10 Feb 2014');
        expect(holidays.get(1).getText()).toContain('From 23 May 2014 until 26 May 2014');
    });

    // For the creation of a holiday, unit tests have been written instead of e2e tests.
});
