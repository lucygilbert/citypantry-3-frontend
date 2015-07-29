describe('Customer delivery addresses', function() {
    var notificationModal = require('../NotificationModal.js');
    var first = true;

    beforeEach(function() {
        if (first) {
            first = false;
            loginAsUser('customer@bunnies.test');
        }

        browser.get('/customer/account-details');
    });

    it('should show the page and the correct details', function() {
        expect(element.all(by.css('h2')).first().getText()).toBe('ACCOUNT DETAILS');
        var firstParagraphText = element(by.css('.account-details-summary')).getText();
        expect(firstParagraphText).toContain('Aperture Science');
        expect(firstParagraphText).toContain('Customer');
        expect(firstParagraphText).toContain('customer@bunnies.test');

        expect(element.all(by.css('h2')).get(1).getText()).toBe('DELIVERY DETAILS');
        expect(element.all(by.css('p.address-label')).get(0).getText()).toBe('Lena Gardens');
        expect(element.all(by.css('p.address-lines')).get(0).getText()).toContain('25 Lena Gardens');
        expect(element.all(by.css('p.address-office-manager-and-telephone')).get(0).getText()).toContain("Bunny Rabbit\n02012345678");

        expect(element.all(by.css('h2')).get(3).getText()).toBe('PAYMENT DETAILS');
        var paymentCardText = element.all(by.css('p.payment-card')).get(0).getText();
        expect(paymentCardText).toContain('MasterCard');
        expect(paymentCardText).toContain('XXXX XXXX XXXX 6789');
        expect(paymentCardText).toContain('11/2016');
    });

    it('should edit the account details', function() {
        element.all(by.css('.link-account')).first().click();
        element.all(by.css('input')).first().clear();
        element.all(by.css('input')).get(1).clear();
        element.all(by.css('input')).first().sendKeys('Zorg Industries');
        element.all(by.css('input')).get(1).sendKeys('Jean-Baptiste Zorg');

        var save = element(by.css('input[type="submit"]'));
        expect(save.getAttribute('value')).toBe('Save changes');
        save.click();

        var firstParagraphText = element(by.css('.account-details-summary')).getText();
        expect(firstParagraphText).toContain('Zorg Industries');
        expect(firstParagraphText).toContain('Jean-Baptiste Zorg');
    });

    it('should redirect to the Edit Delivery Address page', function() {
        element.all(by.css('.cp-edit-delivery-address')).get(0).click();

        expect(browser.getCurrentUrl()).toMatch(/customer\/addresses\/delivery\/[0-9a-f]{24}$/);

        browser.get('/customer/account-details');
    });

    it('should redirect to the Add Delivery Address page', function() {
        element(by.css('.cp-add-delivery-address')).click();

        expect(browser.getCurrentUrl()).toMatch(/customer\/addresses\/delivery\/new$/);

        browser.get('/customer/account-details');
    });

    it('should revert the changes so other tests are not broken', function() {
        element.all(by.css('.link-account')).first().click();
        element.all(by.css('input')).first().clear();
        element.all(by.css('input')).get(1).clear();
        element.all(by.css('input')).first().sendKeys('Aperture Science');
        element.all(by.css('input')).get(1).sendKeys('Customer');
        element.all(by.css('input')).last().click();

        var firstParagraphText = element(by.css('.account-details-summary')).getText();
        expect(firstParagraphText).toContain('Aperture Science');
        expect(firstParagraphText).toContain('Customer');
    });

    describe('payment cards', function() {
        var cards;
        var NUMBER_OF_CARDS_IN_FIXTURES = 1;

        beforeEach(function() {
            cards = element.all(by.repeater('card in paymentCards'));
        });

        it('should list existing cards', function() {
            expect(cards.count()).toBe(NUMBER_OF_CARDS_IN_FIXTURES);
        });

        it('should have a link to add a new card', function() {
            element(by.css('.cp-add-payment-card')).click();
            expect(browser.getCurrentUrl()).toMatch(/user\/payment-cards\/new$/);

            element(by.model('card.number')).sendKeys('4111 1111 1111 1111');
            element.all(by.css('#card-expiry-month > option')).get(1).click();
            element.all(by.css('#card-expiry-year > option')).get(2).click();
            element(by.model('card.cvc')).sendKeys('123');

            element(by.css('input[type="submit"]')).click();

            notificationModal.expectIsOpen();
            notificationModal.expectSuccessHeader();
            notificationModal.expectMessage('Your new card has been added successfully.');
            notificationModal.dismiss();

            browser.get('/customer/account-details');

            expect(cards.count()).toBe(NUMBER_OF_CARDS_IN_FIXTURES + 1);
        });

        it('should have a link to delete a card', function() {
            var deleteLinks = element.all(by.css('.cp-delete-payment-card'));
            expect(deleteLinks.count()).toBe(NUMBER_OF_CARDS_IN_FIXTURES + 1);

            deleteLinks.get(1).click();

            expect(deleteLinks.count()).toBe(NUMBER_OF_CARDS_IN_FIXTURES);
            expect(cards.count()).toBe(NUMBER_OF_CARDS_IN_FIXTURES);
        });
    });
});
