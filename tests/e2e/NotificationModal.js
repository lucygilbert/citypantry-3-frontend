module.exports = {
    expectIsOpen: function() {
        expect(element(by.css('[ng-controller="NotificationModalController"]')).isDisplayed()).toBe(true);
    },

    expectSuccessHeader: function() {
        expect(element(by.css('[ng-controller="NotificationModalController"] .modal-header')).getText()).toBe('Success');
    },

    expectErrorHeader: function() {
        expect(element(by.css('[ng-controller="NotificationModalController"] .modal-header')).getText()).toBe('Error');
    },

    expectMessage: function(message) {
        expect(element(by.css('[ng-controller="NotificationModalController"] .modal-body')).getText()).toBe(message);
    },

    dismiss: function() {
        element(by.css('[ng-controller="NotificationModalController"] .modal-footer button')).click();
    }
};
