describe('Viewing team reviews', function() {
    var first = true;

    beforeEach(function() {
        if (first) {
            first = false;
            loginAsUser('customer@bunnies.test');
            browser.get('/customer/orders');
        }
    });

    it('should have a link to view team reviews', function() {
        var teamReviewsLink = element(by.css('a.view-team-reviews'));
        expect(teamReviewsLink.getText()).toBe('Team reviews');
        teamReviewsLink.click();

        expect(browser.getCurrentUrl()).toMatch(/\.dev\/customer\/orders\/[0-9a-f]{24}\/team-reviews$/);
    });

    it('should display the package details', function() {
        expect(element(by.css('cp-package-detail h3')).isDisplayed()).toBe(true);
        expect(element(by.css('.cp-package-detail-vendor-name')).isDisplayed()).toBe(true);
    });

    it('should show how many team members have rated the order', function() {
        expect(element(by.css('p.lead')).getText())
            .toMatch(/^\d+ out of \d+ have rated this meal as following:$/);
    });
});
