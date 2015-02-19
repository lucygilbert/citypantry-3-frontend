describe('Vendor portal - individual order messages', function() {
    var first = true;

    beforeEach(function() {
        if (first) {
            first = false;
            loginAsUser('vendor@bunnies.test');
            browser.get('/vendor/orders');
            var order = element.all(by.repeater('order in orders')).get(0);
            order.element(by.css('.dropdown a.btn')).click();
            order.element(by.css('.dropdown-menu a[href*="messages"]')).click();
        }
    });

    it('should show the order number and message history', function() {
        expect(element(by.css('h1')).getText()).toMatch(/Order \d message history/);
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
