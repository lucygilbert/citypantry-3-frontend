var notificationModal = require('../NotificationModal.js');

describe('Team - review a past order', function() {
    var first = true;
    var commentField;
    var reviewerNameField;
    var saveButton;

    beforeEach(function() {
        if (first) {
            first = false;
            browser.get('/team/f1c57004e222222222222222/menu');
            element.all(by.css('a[ng-if="showTeamReviewLink"]')).get(0).click();
        }

        commentField = element(by.model('review.review'));
        reviewerNameField = element(by.model('review.reviewerName'));
        saveButton = element(by.css('input[type="submit"]'));
    });

    it('should show a header asking how the meal was', function() {
        expect(element(by.css('h1')).getText()).toBe('HOW WAS YOUR MEAL?');
    });

    it('should not allow the additional comment and reviewer name to be seen until an overall rating is clicked', function() {
        expect(commentField.isPresent()).toBe(false);
        expect(reviewerNameField.isPresent()).toBe(false);
        expect(saveButton.isPresent()).toBe(false);
    });

    it('should allow the order to be rated from 1 to 5', function() {
        element.all(by.css('[cp-rating-stars] i')).get(2).click();
    });

    it('should allow the additional comment and reviewer name to be seen once an overall rating is clicked', function() {
        expect(commentField.isDisplayed()).toBe(true);
        expect(reviewerNameField.isDisplayed()).toBe(true);
        expect(saveButton.isDisplayed()).toBe(true);
    });

    it('should allow the additional comment and reviewer name to be saved', function() {
        commentField.sendKeys('Yummy!');
        reviewerNameField.sendKeys('Squig McSquigington Jr.');
        saveButton.click();
    });

    it('should show a success message', function() {
        notificationModal.expectIsOpen();
        notificationModal.expectSuccessHeader();
        notificationModal.expectMessage('Thanks for your feedback!');
        notificationModal.dismiss();
    });
});
