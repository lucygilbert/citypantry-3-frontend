describe('Pay on account page', function() {
    var notificationModal = require('../NotificationModal.js');
    var textIfDisabled;
    var textIfAdditionalInformationNeeded;
    var textIfEnabled;
    var form;

    beforeEach(function() {
        textIfDisabled = element(by.css('p[ng-if="status === 0"]'));
        textIfAdditionalInformationNeeded = element(by.css('p[ng-if="status === 1"]'));
        textIfEnabled = element(by.css('p[ng-if="status === 2"]'));
        form = element(by.css('form[ng-if="status !== 0"]'));
    });

    function navigateToPageAsUser(email) {
        loginAsUser(email);
        browser.get('/customer/pay-on-account');
    }

    describe('as a user who is not paid on account', function() {
        it('should be able to navigate to the page', function() {
            navigateToPageAsUser('customer@bunnies.test');
        });

        it('should show the "pay on account" page', function() {
            expect(element(by.css('main h2')).getText()).toBe('PAY ON ACCOUNT');
        });

        it('should tell the user to contact support', function() {
            expect(textIfDisabled.isPresent()).toBe(true);
            expect(textIfAdditionalInformationNeeded.isPresent()).toBe(false);
            expect(textIfEnabled.isPresent()).toBe(false);
            expect(form.isPresent()).toBe(false);
        });
    });

    describe('as a user whose pay-on-account status needs additional information', function() {
        it('should be able to navigate to the page', function() {
            navigateToPageAsUser('alice@bunnies.test');
        });

        it('should tell the user to fill in the form', function() {
            expect(textIfDisabled.isPresent()).toBe(false);
            expect(textIfAdditionalInformationNeeded.isPresent()).toBe(true);
            expect(textIfEnabled.isPresent()).toBe(false);
            expect(form.isPresent()).toBe(true);

            var topText = textIfAdditionalInformationNeeded.getText();
            expect(topText).toContain('Please supply the following information');
            expect(topText).toContain('Your maximum monthly spend will be £100.00');
            expect(topText).toContain('your payment terms will be Net 30');
        });

        it('should be able to complete the form, and be told that they are now able to pay on account', function() {
            element(by.model('user.customer.accountsContactName')).sendKeys('Accounts Department');
            element(by.model('user.customer.accountsEmail')).sendKeys('accounts@citypantry.com');
            element(by.model('user.customer.accountsTelephoneNumber')).sendKeys('020 3397 8376');

            element(by.css('main input.btn-primary')).click();

            notificationModal.expectIsOpen();
            notificationModal.expectSuccessHeader();
            notificationModal.expectMessage('You are now approved to pay on account.');
            notificationModal.dismiss();

            expect(textIfDisabled.isPresent()).toBe(false);
            expect(textIfAdditionalInformationNeeded.isPresent()).toBe(false);
            expect(textIfEnabled.isPresent()).toBe(true);
            expect(form.isPresent()).toBe(true);
        });
    });

    describe('as a user who can pay on account', function() {
        it('should be able to navigate to the page', function() {
            navigateToPageAsUser('customer@apple.test');
        });

        it('should tell the user that they are able to pay on account', function() {
            expect(textIfDisabled.isPresent()).toBe(false);
            expect(textIfAdditionalInformationNeeded.isPresent()).toBe(false);
            expect(textIfEnabled.isPresent()).toBe(true);
            expect(form.isPresent()).toBe(true);

            var topText = textIfEnabled.getText();
            expect(topText).toContain('You are approved to pay on account');
            expect(topText).toContain('Your maximum monthly spend is £10,000.00');
            expect(topText).toContain('and your payment terms are EOM');
        });

        it('should be able to update their details', function() {
            expect(element(by.model('user.customer.accountsContactName')).getAttribute('value')).toBe('Cinderella');

            element(by.css('main input.btn-primary')).click();

            notificationModal.expectIsOpen();
            notificationModal.expectSuccessHeader();
            notificationModal.expectMessage('Your pay on account details have been updated.');
            notificationModal.dismiss();
        });
    });
});
