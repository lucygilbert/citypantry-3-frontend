describe('Customer - individual order messages', function() {
    var first = true;

    beforeEach(function() {
        if (first) {
            first = false;
            loginAsUser('customer@bunnies.test');
            browser.get('/customer/orders');
            var order = element.all(by.repeater('order in orders')).get(0);
            var messagesLink = order.element(by.css('a.send-message'));
            expect(messagesLink.getText()).toBe('Vendor');
            messagesLink.click();
        }
    });

    it('should show the order number and message history', function() {
        expect(element(by.css('h2.cp-heading')).getText()).toMatch(/^ORDER \d+ MESSAGE HISTORY$/);
    });

    it('should start with no messages', function() {
        expect(element.all(by.repeater('message in messages')).count()).toBe(0);
    });

    it('should be able to send a message', function() {
        element(by.model('message')).sendKeys('Hello, this is my message.');
        element(by.css('main button')).click();
        expect(element.all(by.repeater('message in messages')).count()).toBe(1);

        var newMesageText = element.all(by.repeater('message in messages')).get(0).getText();
        expect(newMesageText).toContain('From you on');
        expect(newMesageText).toContain('Hello, this is my message.');
    });
});
