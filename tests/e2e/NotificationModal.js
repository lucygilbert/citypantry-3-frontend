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

    /**
     * @param {String|RegExp} expectedMessage
     */
    expectMessage: function(expectedMessage) {
        var actualText = element(by.css(modalSelector + ' .modal-body')).getText();

        if (expectedMessage instanceof RegExp) {
            expect(actualText).toMatch(expectedMessage);
        } else {
            expect(actualText).toBe(expectedMessage);
        }
    },

    expectIsOpenWithSuccessMessage: function(expectedMessage) {
        this.expectIsOpen();
        this.expectSuccessHeader();
        this.expectMessage(expectedMessage);
    },

    expectIsOpenWithErrorMessage: function(expectedMessage) {
        this.expectIsOpen();
        this.expectErrorHeader();
        this.expectMessage(expectedMessage);
    },

    dismiss: function() {
        element(by.css(modalSelector + ' .modal-footer button')).click();
    }
};
