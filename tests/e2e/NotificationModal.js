var modalSelector = '[ng-controller="NotificationModalController"]';

module.exports = {
    expectIsOpen: function() {
        expect(element(by.css(modalSelector)).isDisplayed()).toBe(true);
    },

    expectIsClosed: function() {
        expect(element(by.css(modalSelector)).isDisplayed()).toBe(false);
    },

    expectSuccessHeader: function() {
        expect(element(by.css(modalSelector + ' .modal-header')).getText()).toBe('Success');
    },

    expectErrorHeader: function() {
        expect(element(by.css(modalSelector + ' .modal-header')).getText()).toBe('Error');
    },

    expectMessage: function(message) {
        expect(element(by.css(modalSelector + ' .modal-body')).getText()).toBe(message);
    },

    dismiss: function() {
        element(by.css(modalSelector + ' .modal-footer button')).click();
    }
};
