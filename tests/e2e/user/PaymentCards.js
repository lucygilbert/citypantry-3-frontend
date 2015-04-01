describe('Payment cards', function() {
    var first = true;

    beforeEach(function() {
        if (first) {
            first = false;
            loginAsUser('customer@bunnies.test');
            browser.get('/user/payment-cards');
        }
    });

    it('should show the payment cards page', function() {
        expect(element(by.css('h2')).getText()).toBe('PAYMENT CARDS');
    });

    it('should have one payment card already', function() {
        var addresses = element.all(by.repeater('card in cards'));
        expect(addresses.count()).toBe(1);
        expect(addresses.get(0).getText()).toContain('MasterCard');
        expect(addresses.get(0).getText()).toContain('xxxx xxxx xxxx 6789');
        expect(addresses.get(0).getText()).toContain('11/2016');
    });

    it('should link to a form to add a new card', function() {
        element(by.css('main a.btn-primary')).click();
        expect(browser.getCurrentUrl()).toMatch(/\.dev\/user\/payment-cards\/new$/);

        expect(element.all(by.css('main input[type="number"]')).count()).toBe(2);
        expect(element.all(by.css('main select')).count()).toBe(2);
    });

    // There is no test for actually adding a card because we don't want to clutter up the Braintree
    // account with test data.
});
