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

    it('should be able to edit the customer persona', function() {
        element(by.cssContainingText('select[name="customerPersona"] option', 'The Big Dog')).click();
    });

    it('should be able to edit the customer sales staff type', function() {
        element(by.cssContainingText('select[name="customerSalesStaffType"] option', 'Non-premium')).click();
    });

    it('should be able to edit the pay-on-account invoice recipient', function() {
        element(by.cssContainingText('select[name="customerPayOnAccountInvoiceRecipient"] option', 'Customer and City Pantry')).click();
    });

    it('should be able to save the edited customer', function() {
        element(by.css('input[type="submit"]')).click();

        notificationModal.expectIsOpen();
        notificationModal.expectSuccessHeader();
        notificationModal.expectMessage('The customer has been edited.');
        notificationModal.dismiss();
    });

    it('should show the new customer values', function() {
        var displayedDetails = element(by.id('cp-customer-details')).getText();

        expect(displayedDetails).toContain('Persona: The Big Dog');
        expect(displayedDetails).toContain('Sales staff type: Non-premium');
        expect(displayedDetails).toContain('Send auto-generated pay-on-account invoices to: Customer and City Pantry');
    });

    function goToEditCustomerPage(email) {
        browser.get('/admin/customers');

        gridTestUtils.enterFilterInColumn('customers-table', EMAIL_COLUMN_IN_CUSTOMERS_PAGE, email);
        element.all(by.css('#customers-table a[href^="/admin/customer/"]')).first().click();
        expect(element(by.css('main')).getText()).toContain('Email: ' + email);
    }

    describe('masquerading', function() {
        it('should be able to masquerade as the customer\'s user', function() {
            goToEditCustomerPage('james@mi6.test');

            element.all(by.css('a.cp-masquerade')).get(0).click();

            browser.wait(function() {
                return browser.getCurrentUrl().then(function(url) {
                    return /\.dev\/customer\/dashboard$/.test(url);
                });
            }, 15000);
        });

        it('should have a button to return to being staff, which prompts for a password', function() {
            element(by.css('a[ng-if="isStaffMasquerading"]')).click();
            element(by.model('plainPassword')).sendKeys('password');
            element(by.id('login_button')).click();
        });

        it('should be the staff user again', function() {
            expect(browser.getCurrentUrl()).toMatch(/\/admin\/users$/);
        });
    });

    describe('with a customer who is not able to pay on account', function() {
        it('should be able to navigate to their page', function() {
            goToEditCustomerPage('customer@bunnies.test');
        });

        it('should show that the customer is not able to pay on account', function() {
            expect(element(by.css('main')).getText()).toContain('Pay on account? Disabled');
        });

        it('should allow staff to set up a request to pay on account', function() {
            element(by.css('#invoice_payment_terms')).clear();
            element(by.css('#max_spend_per_month')).clear();

            element(by.css('#invoice_payment_terms')).sendKeys('Net 30');
            element(by.css('#max_spend_per_month')).sendKeys('3000');
            element(by.css('#save_setup_details')).click();

            notificationModal.expectIsOpen();
            notificationModal.expectSuccessHeader();
            notificationModal.expectMessage('The request to pay on account has been set up.');
            notificationModal.dismiss();
        });

        it('should list their delivery addresses', function() {
            var addresses = element.all(by.repeater('address in deliveryAddresses'));
            expect(addresses.count()).toBe(1);

            expect(addresses.get(0).getText()).toContain('Mega Things Ltd');
        });

        it('should list their billing addresses', function() {
            var addresses = element.all(by.repeater('address in billingAddresses'));
            expect(addresses.count()).toBe(1);

            expect(addresses.get(0).getText()).toContain('Mega Things Ltd Accounts');
        });

        it('should be able to set a billing address as for invoices and receipts', function() {
            var address = element.all(by.repeater('address in billingAddresses')).get(0);

            var link = address.element(by.css('a'));
            link.click();

            expect(address.getText()).toContain('Used for invoices and receipts');
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

        it('should allow staff to change the customer\'s max monthly spend and payment terms', function() {
            element(by.css('#invoice_payment_terms')).clear();
            element(by.css('#max_spend_per_month')).clear();

            element(by.css('#invoice_payment_terms')).sendKeys('Net 30');
            element(by.css('#max_spend_per_month')).sendKeys('3000');
            element(by.css('#save_request_account_details')).click();

            notificationModal.expectIsOpen();
            notificationModal.expectSuccessHeader();
            notificationModal.expectMessage('The details have been updated.');
            notificationModal.dismiss();
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

        it('should allow staff to change the customer\'s pay on account details', function() {
            element(by.css('#accounts_contact_name')).clear();
            element(by.css('#accounts_email')).clear();
            element(by.css('#accounts_telephone_number')).clear();
            element(by.css('#days_until_invoice_overdue')).clear();
            element(by.css('#invoice_payment_terms')).clear();
            element(by.css('#max_spend_per_month')).clear();

            element(by.css('#accounts_contact_name')).sendKeys('Walter White');
            element(by.css('#accounts_email')).sendKeys('wwhite@meth.org');
            element(by.css('#accounts_telephone_number')).sendKeys('02012345678');
            element(by.css('#days_until_invoice_overdue')).sendKeys('15');
            element(by.css('#invoice_payment_terms')).sendKeys('Net 30');
            element(by.css('#max_spend_per_month')).sendKeys('3000');
            element(by.css('#save_enabled_account_details')).click();

            notificationModal.expectIsOpen();
            notificationModal.expectSuccessHeader();
            notificationModal.expectMessage('The details have been updated.');
            notificationModal.dismiss();
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
