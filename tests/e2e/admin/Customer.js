describe('Admin - customer page', function() {
    var notificationModal = require('../NotificationModal.js');

    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/customers');
            element.all(by.css('#customers-table a[href^="/admin/customer/"]')).last().click();
            browser.wait(function() {
                return browser.getCurrentUrl().then(function(url) {
                    return (/\/admin\/customer\/[\da-f]+$/.test(url));
                });
            });
            isFirst = false;
        }
    });

    it('should show the "customer" page', function() {
        expect(browser.getCurrentUrl()).toMatch(/\/admin\/customer\/[\da-f]+$/);
        expect(element(by.css('h1')).getText()).toMatch(/^Customer [\da-f]+/);
    });

    it('should load and display the customer details', function() {
        expect(element(by.css('main')).getText()).toMatch(/Is paid on account\? (Yes|No)/);
        expect(element(by.css('main')).getText()).toMatch(/Customer since: \d{2}\/\d{2}\/\d{4}/);
        expect(element(by.css('main')).getText()).toMatch(/Email: [a-z0-9@\.]+/);
        expect(element(by.css('main')).getText()).toMatch(/User group: [a-zA-Z ]+/);
    });

    it('should load the pay on account details and show the "approve" and "reject" buttons', function() {
        expect(element(by.model('customer.accountsContactName')).getAttribute('value')).toBe('Flopsy');
        expect(element(by.model('customer.accountsEmail')).getAttribute('value')).toBe('accounts@bunnies.test');
        expect(element(by.model('customer.accountsTelephoneNumber')).getAttribute('value')).toBe('07987833834');
        expect(element(by.model('customer.invoicePaymentTerms')).getAttribute('value')).toBe('Net 30');
        expect(element(by.model('customer.maxSpendPerMonth')).getAttribute('value')).toBe('100');

        expect(element(by.css('button[ng-click="approveRequestToPayOnAccount()"]')).isPresent()).toBe(true);
        expect(element(by.css('button[ng-click="rejectRequestToPayOnAccount()"]')).isPresent()).toBe(true);
        expect(element(by.css('button[ng-click="revokePaymentOnAccount()"]')).isPresent()).toBe(false);
    });

    it('should be able to approve the request to pay on account', function() {
        element(by.css('button[ng-click="approveRequestToPayOnAccount()"]')).click();

        notificationModal.expectIsOpen();
        notificationModal.expectSuccessHeader();
        notificationModal.expectMessage('The request to pay on account has been approved.');
        notificationModal.dismiss();

        expect(element(by.css('button[ng-click="approveRequestToPayOnAccount()"]')).isPresent()).toBe(false);
        expect(element(by.css('button[ng-click="rejectRequestToPayOnAccount()"]')).isPresent()).toBe(false);
        expect(element(by.css('button[ng-click="revokePaymentOnAccount()"]')).isPresent()).toBe(true);
    });

    it('should be able to revoke payment on account', function() {
        element(by.css('button[ng-click="revokePaymentOnAccount()"]')).click();

        notificationModal.expectIsOpen();
        notificationModal.expectSuccessHeader();
        notificationModal.expectMessage('Payment on account has been revoked.');
        notificationModal.dismiss();

        expect(element(by.model('customer.accountsContactName')).isPresent()).toBe(false);
        expect(element(by.model('customer.accountsEmail')).isPresent()).toBe(false);
        expect(element(by.model('customer.accountsTelephoneNumber')).isPresent()).toBe(false);
        expect(element(by.model('customer.invoicePaymentTerms')).isPresent()).toBe(false);
        expect(element(by.model('customer.maxSpendPerMonth')).isPresent()).toBe(false);
    });
});
