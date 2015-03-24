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
        expect(element(by.css('h3')).getText()).toBe('Aperture Science');
        expect(element.all(by.css('p')).first().getText()).toContain('Customer');
        expect(element.all(by.css('p')).first().getText()).toContain('customer@bunnies.test');

        expect(element.all(by.css('h2')).get(1).getText()).toBe('DELIVERY DETAILS');
        expect(element.all(by.css('p')).get(1).getText()).toBe('Lena Gardens');
        expect(element.all(by.css('p')).get(2).getText()).toContain('25 Lena Gardens');
        expect(element.all(by.css('p')).get(3).getText()).toContain('Bunny Rabbit');
        expect(element.all(by.css('p')).get(3).getText()).toContain('02012345678');

        expect(element.all(by.css('h2')).get(2).getText()).toBe('PAYMENT DETAILS');
        expect(element.all(by.css('p')).get(4).getText()).toContain('MasterCard');
        expect(element.all(by.css('p')).get(4).getText()).toContain('6789');
        expect(element.all(by.css('p')).get(4).getText()).toContain('11/2016');
    });

    it('should edit the account details', function() {
        element.all(by.css('.link-account')).first().click();
        element.all(by.css('input')).first().clear();
        element.all(by.css('input')).get(1).clear();
        element.all(by.css('input')).get(2).clear();
        element.all(by.css('input')).first().sendKeys('Zorg Industries');
        element.all(by.css('input')).get(1).sendKeys('Jean-Baptiste Zorg');
        element.all(by.css('input')).get(2).sendKeys('jbzorg@z.org');
        element.all(by.css('input')).last().click();

        expect(element(by.css('h3')).getText()).toBe('Zorg Industries');
        expect(element.all(by.css('p')).first().getText()).toContain('Jean-Baptiste Zorg');
        expect(element.all(by.css('p')).first().getText()).toContain('jbzorg@z.org');
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
        element.all(by.css('input')).get(2).clear();
        element.all(by.css('input')).first().sendKeys('Aperture Science');
        element.all(by.css('input')).get(1).sendKeys('Customer');
        element.all(by.css('input')).get(2).sendKeys('customer@bunnies.test');
        element.all(by.css('input')).last().click();

        expect(element(by.css('h3')).getText()).toBe('Aperture Science');
        expect(element.all(by.css('p')).first().getText()).toContain('Customer');
        expect(element.all(by.css('p')).first().getText()).toContain('customer@bunnies.test');
    });
});
