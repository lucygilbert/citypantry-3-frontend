describe('Admin - creating a promo code', function() {
    var notificationModal = require('../NotificationModal.js');
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            isFirst = false;

            loginAsUser('alice@bunnies.test');
            browser.get('/admin/promo-codes');

            var createButton = element(by.css('a.cp-create-promo-code'));
            expect(createButton.getText()).toBe('CREATE A PROMO CODE');
            createButton.click();
        }
    });

    it('should have the title "Create a promo code"', function() {
        expect(element(by.css('h1')).getText()).toBe('Create a promo code');
    });

    it('should be able to fill in the basic form fields', function() {
        element(by.model('promoCode.code')).sendKeys('NEW_CODE');
        element(by.model('promoCode.discount')).sendKeys(56);
        element(by.cssContainingText('option', 'Fixed')).click();
        element(by.cssContainingText('option', 'Discount')).click();
    });

    it('should created the promo code when the create button is clicked', function() {
        var createButton = element(by.css('.cp-create-promo-code'));
        expect(createButton.getAttribute('value')).toBe('Create promo code');
        createButton.click();
    });

    it('should show a success message', function() {
        notificationModal.expectIsOpen();
        notificationModal.expectSuccessHeader();
        notificationModal.expectMessage('The promo code has been created.');
        notificationModal.dismiss();
    });

    it('should no longer show the create button', function() {
        var createButton = element(by.css('.cp-create-promo-code'));
        expect(createButton.isPresent()).toBe(false);
    });
});

describe('Admin - creating a duplicate promo code', function() {
    var notificationModal = require('../NotificationModal.js');
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            isFirst = false;

            loginAsUser('alice@bunnies.test');
            browser.get('/admin/promo-codes');

            var createButton = element(by.css('a.cp-create-promo-code'));
            expect(createButton.getText()).toBe('CREATE A PROMO CODE');
            createButton.click();
        }
    });

    it('should be able to fill in the basic form fields', function() {
        // The promo code 'TEST' already exists.
        element(by.model('promoCode.code')).sendKeys('TEST');

        element(by.model('promoCode.discount')).sendKeys(56);
        element(by.cssContainingText('option', 'Fixed')).click();
        element(by.cssContainingText('option', 'Discount')).click();
    });

    it('should not allow the duplicate code to be created', function() {
        var createButton = element(by.css('.cp-create-promo-code'));
        createButton.click();

        notificationModal.expectIsOpen();
        notificationModal.expectErrorHeader();
        notificationModal.expectMessage('The promo code "TEST" has already been used.');
        notificationModal.dismiss();
    });
});
