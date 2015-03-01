describe('Search', function() {
    var first = true;
    var notificationModal = require('../NotificationModal.js');

    beforeEach(function() {
        if (first) {
            first = false;
            loginAsUser('customer@bunnies.test');
            browser.get('/quote');
        }
    });

    it('should show the form', function() {
        expect(element.all(by.css('main input')).count()).toBe(4);
    });

    it('should send the quote request and reset the fields', function () {
        var name = element(by.id('name'));
        var email = element(by.id('email'));
        var tel = element(by.id('tel'));
        var purpose = element(by.id('purpose'));
        var sendBtn = element(by.css('input[type="submit"]'));

        name.sendKeys('Bunny');
        email.sendKeys('bunnyr@b.bit');
        tel.sendKeys('01952111222');
        purpose.sendKeys('Food.');
        sendBtn.click();

        notificationModal.expectIsOpen();
        notificationModal.expectSuccessHeader();
        notificationModal.expectMessage('Your request has been sent.');
        notificationModal.dismiss();

        expect(name.getAttribute('value')).toBe('');
        expect(email.getAttribute('value')).toBe('');
        expect(tel.getAttribute('value')).toBe('');
        expect(purpose.getAttribute('value')).toBe('');
    });
});
