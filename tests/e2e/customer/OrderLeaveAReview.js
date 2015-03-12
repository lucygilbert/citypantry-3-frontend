describe('Leaving a review for an order', function() {
    var notificationModal = require('../NotificationModal.js');
    var first = true;

    beforeEach(function() {
        if (first) {
            first = false;
            loginAsUser('customer@bunnies.test');
            browser.get('/customer/orders');
        }
    });

    it('should have a link to leave a review in the dropdown menu', function() {
        var order = element.all(by.repeater('order in orders')).get(0);
        order.element(by.css('.dropdown > a')).click();

        var link = order.element(by.css('.dropdown .leave-a-review a'));
        expect(link.isDisplayed()).toBe(true);
        expect(link.getText()).toBe('Leave a review');
        link.click();

        expect(browser.getCurrentUrl()).toMatch(/\.dev\/customer\/orders\/[0-9a-f]{24}\/leave-a-review$/);
    });

    it('should display the package name in the title', function() {
        expect(element(by.css('main h1')).getText()).toBe('Leave a review for: Marshmallows');
    });

    it('should not allow an empty review to be saved', function() {
        element(by.css('textarea')).clear();
        element(by.css('main input[type="submit"]')).click();

        expect(element(by.css('main')).getText()).toContain('This field is required.');

        notificationModal.expectIsClosed();
    });

    it('should not allow short reviews to be saved', function() {
        element(by.css('textarea')).clear().sendKeys('It\'s OK.');
        element(by.css('main input[type="submit"]')).click();

        notificationModal.expectIsOpen();
        notificationModal.expectErrorHeader();
        notificationModal.expectMessage('Your review is too short.');
        notificationModal.dismiss();
    });

    it('should allow long reviews to be saved', function() {
        element(by.css('textarea')).clear().sendKeys('It was a yummy meal.');
        element(by.css('main input[type="submit"]')).click();

        notificationModal.expectIsOpen();
        notificationModal.expectSuccessHeader();
        notificationModal.expectMessage('Thank you for your review.');
        notificationModal.dismiss();
    });
});
