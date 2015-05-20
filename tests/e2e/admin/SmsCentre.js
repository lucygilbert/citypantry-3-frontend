var notificationModal = require('../NotificationModal.js');

describe('Admin - SMS centre', function() {
    var isFirst = true;
    var toInput;
    var bodyInput;
    var sendNavButton;
    var inboxNavButton;
    var sentboxNavButton;
    var inboxMessageItem;
    var sentboxMessageItem;
    var inboxBackButton;
    var inboxReplyButton;
    var sendButton;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/sms-centre');
            isFirst = false;
        }

        toInput = element(by.model('newMessage.toNumber'));
        bodyInput = element(by.model('newMessage.message'));
        sendNavButton = element.all(by.css('li > button')).first();
        inboxNavButton = element.all(by.css('li > button')).get(1);
        sentboxNavButton = element.all(by.css('li > button')).last();
        inboxMessageItem = element.all(by.css('.cp-sms-message-list-item')).first();
        sentboxMessageItem = element.all(by.css('.cp-sms-message-list-item')).get(1);
        inboxBackButton = element.all(by.css('.cp-sms-nav > button')).first();
        inboxReplyButton = element.all(by.css('.cp-sms-nav > button')).get(1);
        sendButton = element.all(by.css('.cp-sms-nav > button')).first();
    });

    it('should display inbox messages', function() {
        expect(element.all(by.css('.cp-sms-message-list:first-child > button')).count()).toBe(1);
    });

    it('should let you view a message when clicked', function() {
        inboxMessageItem.click();
        expect(element.all(by.css('h4')).first().isDisplayed()).toBe(true);
        expect(element.all(by.css('h4')).first().getText()).toContain('FROM');
    });

    it('should take you back to the list when you click Back', function() {
        inboxBackButton.click();
        expect(inboxMessageItem.isDisplayed()).toBe(true);
    });

    it('should display sentbox messages', function() {
        sentboxNavButton.click();
        expect(element.all(by.css('.cp-sms-message-list:last-child > button')).count()).toBe(3);
    });

    it('should prefilled the To field when you click Reply', function() {
        inboxNavButton.click();
        inboxMessageItem.click();
        inboxReplyButton.click();
        expect(toInput.getAttribute('value')).toBe('+441952000001');
    });

    it('should let you send a message', function() {
        bodyInput.sendKeys('I coulda had class. I coulda been a contender. I coulda been somebody.');
        sendButton.click();
        notificationModal.expectIsOpen();
        notificationModal.expectSuccessHeader();
        notificationModal.expectMessage('Message sent.');
    });
});
