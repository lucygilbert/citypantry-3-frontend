describe('Customer delivery addresses', function() {
    var first = true;

    beforeEach(function() {
        if (first) {
            first = false;
            loginAsUser('customer@bunnies.test');
            browser.get('/customer/account-details');
        }
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

        expect(element.all(by.css('h2')).get(2).getText()).toBe('PAYMENT DETAILS');
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

    it('should redirect to the Edit Address page', function() {
        element.all(by.css('.link-account')).get(1).click();

        expect(browser.getCurrentUrl()).toMatch(/customer\/addresses/);

        browser.get('/customer/account-details');
    });

    it('should redirect to the Add Address page', function() {
        element.all(by.css('.link-account')).get(2).click();

        expect(browser.getCurrentUrl()).toMatch(/customer\/addresses\/new$/);

        browser.get('/customer/account-details');
    });

    it('should redirect to the Add Card page', function() {
        element.all(by.css('.link-account')).get(3).click();

        expect(browser.getCurrentUrl()).toMatch(/user\/payment-cards\/new$/);

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
});
