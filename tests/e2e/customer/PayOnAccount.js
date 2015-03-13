describe('Pay on account page', function() {
    var notificationModal = require('../NotificationModal.js');

    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('customer@bunnies.test');
            browser.get('/customer/pay-on-account');
            isFirst = false;
        }
    });

    it('should show the "pay on account" page', function() {
        expect(element(by.css('h1')).getText()).toBe('Pay on account');
    });

    it('should highlight the "pay on account" link in the sidebar', function() {
        var activeLinks = element.all(by.css('.sidebar-menu li.active'));
        expect(activeLinks.count()).toBe(1);
        expect(activeLinks.first().getText()).toBe('Pay on account');
    });

    it('should be able to save the pay on account details', function() {
        element(by.model('user.customer.accountsContactName')).sendKeys('Accounts Department');
        element(by.model('user.customer.accountsEmail')).sendKeys('accounts@citypantry.com');
        element(by.model('user.customer.accountsTelephoneNumber')).sendKeys('020 3397 8376');
        element(by.model('user.customer.invoicePaymentTerms')).sendKeys('Net 10');
        element(by.model('user.customer.maxSpendPerMonth')).sendKeys('100');

        element(by.css('main input.btn-primary')).click();

        notificationModal.expectIsOpen();
        notificationModal.expectSuccessHeader();
        notificationModal.expectMessage('Your request to pay on account has been sent.');
        notificationModal.dismiss();

        expect(element(by.css('main')).getText()).toContain('We’ve received your request to pay on account.')
    });
});
