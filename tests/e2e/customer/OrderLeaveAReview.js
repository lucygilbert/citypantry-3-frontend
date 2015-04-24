describe('Leaving a review for an order', function() {
    var notificationModal = require('../NotificationModal.js');
    var first = true;
    var foodQualityRating;
    var presentationRating;
    var deliveryRating;
    var overallRating;
    var isDeliveredOnTime;
    var comment;
    var recommendToFriendRating;
    var submit;

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

        var stars = element.all(by.css('.cp-star-rating-group'));
        foodQualityRating = stars.get(0);
        presentationRating = stars.get(1);
        deliveryRating = stars.get(2);
        overallRating = stars.get(3);
        isDeliveredOnTime = element(by.css('.cp-is-delivered-on-time'));
        comment = element(by.model('review.review'));
        recommendToFriendRating = element(by.css('.cp-form-group.cp-recommend-to-friend-rating'));
        submit = element(by.css('.cp-btn-primary'));
    });

    it('should display the package details', function() {
        expect(element(by.css('.cp-review-package h3')).getText()).toBe('BEEF AND MIXED VEG CURRY');
        expect(element(by.css('.cp-review-package-vendor-name')).getText()).toBe('Oriental Kitchen Express');
    });

    function getStar(parent, number) {
        return parent.element(by.css('i[ng-click="set(' + number + ')"]'));
    }

    it('should be able to set star ratings for food quality, etc.', function() {
        getStar(foodQualityRating, 3).click();
        getStar(presentationRating, 5).click();
        getStar(deliveryRating, 1).click();
        getStar(overallRating, 4).click();
    });

    it('should be able to complete the other form fields', function() {
        isDeliveredOnTime.all(by.css('input')).get(0).click();
        recommendToFriendRating.all(by.css('.rating')).get(7).click();
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
