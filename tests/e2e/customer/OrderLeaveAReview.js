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

    it('should have a link to leave a review', function() {
        var order = element.all(by.repeater('order in orders')).get(0);
        var leaveAReviewLink = order.element(by.css('a.leave-a-review'));
        expect(leaveAReviewLink.getText()).toBe('Write review');
        leaveAReviewLink.click();

        expect(browser.getCurrentUrl()).toMatch(/\.dev\/customer\/orders\/[0-9a-f]{24}\/leave-a-review$/);
    });

    it('should display the package name in the title', function() {
        expect(element(by.css('main   h2')).getText()).toBe('LEAVE A REVIEW FOR: BEEF AND MIXED VEG CURRY');
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
        notificationModal.expectMessage('Thanks for your review.');
        notificationModal.dismiss();

        expect(browser.getCurrentUrl()).toMatch(/\.dev\/customer\/orders$/);
    });
});
