describe('Admin - customer page', function() {
    var notificationModal = require('../NotificationModal.js');
    var gridTestUtils = require('../lib/gridTestUtils.spec.js');
    var isFirst = true;
    var EMAIL_COLUMN_IN_CUSTOMERS_PAGE = 3;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/customers');
            element.all(by.css('#customers-table a[href^="/admin/customer/"]')).last().click();
            isFirst = false;
        }
    });

    it('should show the "customer" page', function() {
        expect(browser.getCurrentUrl()).toMatch(/\/admin\/customer\/[\da-f]{24}$/);
        expect(element(by.css('h1')).getText()).toMatch(/^Customer \d+: .+, .+$/);
    });

    it('should load and display the customer details', function() {
        expect(element(by.css('main')).getText()).toMatch(/Customer since: \d{2}\/\d{2}\/\d{4}/);
        expect(element(by.css('main')).getText()).toMatch(/Email: [a-z0-9@\.]+/);
        expect(element(by.css('main')).getText()).toMatch(/User group: [a-zA-Z ]+/);
    });

    function goToEditCustomerPage(email) {
        browser.get('/admin/customers');

        gridTestUtils.enterFilterInColumn('customers-table', EMAIL_COLUMN_IN_CUSTOMERS_PAGE, email);
        element.all(by.css('#customers-table a[href^="/admin/customer/"]')).first().click();
        expect(element(by.css('main')).getText()).toContain('Email: ' + email);
    }

    describe('with a customer who is not able to pay on account', function() {
        it('should be able to navigate to their page', function() {
            goToEditCustomerPage('customer@bunnies.test');
        });

        it('should show that the customer is not able to pay on account', function() {
            expect(element(by.css('main')).getText()).toContain('Pay on account? Disabled');
        });
    });

    describe('with a customer whose pay-on-account status is awaiting additional information', function() {
        it('should be able to navigate to their page', function() {
            goToEditCustomerPage('alice@bunnies.test');
        });

        it('should show that the customer needs to provide additional information', function() {
            expect(element(by.css('main')).getText()).toContain('Pay on account? Additional information needed');
        });

        it('should show their payment terms and limit', function() {
            expect(element(by.model('customer.invoicePaymentTerms')).isPresent()).toBe(true);
            expect(element(by.model('customer.maxSpendPerMonth')).isPresent()).toBe(true);
        });
    });

    describe('with a customer who can pay on account', function() {
        it('should be able to navigate to their page', function() {
            goToEditCustomerPage('customer@apple.test');
        });

        it('should show that the customer can pay on account', function() {
            expect(element(by.css('main')).getText()).toContain('Pay on account? Enabled');
        });

        it('should show their payment terms and limit', function() {
            expect(element(by.model('customer.invoicePaymentTerms')).isPresent()).toBe(true);
            expect(element(by.model('customer.maxSpendPerMonth')).isPresent()).toBe(true);
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

    describe('with a customer who is not on meal plan', function() {
        it('should be able to navigate to their page', function() {
            goToEditCustomerPage('alice@bunnies.test');
        });

        it('should show that the customer is not on meal plan', function() {
            expect(element(by.css('main')).getText()).toContain('Meal plan status: None.');
        });

        it('should have a link to add the customer to meal plan', function() {
            expect(element(by.css('.cp-add-to-meal-plan')).isPresent()).toBe(true);
        });
    });

    describe('with a customer who is on meal plan', function() {
        it('should be able to navigate to their page', function() {
            goToEditCustomerPage('customer@apple.test');
        });

        it('should show that the customer is on meal plan', function() {
            expect(element(by.css('main')).getText()).toContain('Meal plan status: Active.');
        });

        it('should not have a link to add the customer to meal plan', function() {
            expect(element(by.css('.cp-add-to-meal-plan')).isPresent()).toBe(false);
        });
    });
});
