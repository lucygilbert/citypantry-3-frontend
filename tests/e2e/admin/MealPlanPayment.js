// @todo - fix these tests.
xdescribe('Meal plan payment', function() {
    var gridTestUtils = require('../lib/gridTestUtils.spec.js');
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/meal-plan');
            gridTestUtils.enterFilterInColumn('meal-plan-table', 2, 'Requested callback');
            element.all(by.css('#meal-plan-table a[href^="/admin/meal-plan/customer/"]')).first().click();
            expect(browser.getCurrentUrl()).toMatch(/\/admin\/meal-plan\/customer\/[0-9a-f]{24}\/setup$/);
            isFirst = false;
        }
    });

    // @todo - proceed through setup.

    it('should have the title "Meal plan summary"', function() {
        expect(element(by.css('h1')).getText()).toBe('MEAL PLAN SUMMARY');
    });

    it('should show the meal plan orders', function() {
        var mealPlanOrders = element.all(by.css(''));
        expect(mealPlanOrders.count()).toBe(12);

        expect(mealPlanOrders.get(0).getText()).toContain('13:00');
        expect(mealPlanOrders.get(0).getText()).toContain('02/03/2015');
        expect(mealPlanOrders.get(0).getText()).toContain('Benito\'s Baby Feast');
        expect(mealPlanOrders.get(0).getText()).toContain('xxx.xx');

        expect(mealPlanOrders.get(1).getText()).toContain('13:00');
        expect(mealPlanOrders.get(1).getText()).toContain('03/03/2015');
        expect(mealPlanOrders.get(1).getText()).toContain('Simply Mediterranean');
        expect(mealPlanOrders.get(1).getText()).toContain('xxx.xx');
    });

    it('should show the meal plan total amount', function() {
        expect(element(by.css(''))).toContain('xxxx.xx');
    });

    it('should load the customer\'s cards and select the first by default', function() {
        var cards = element.all(by.css('#payment_method > option'));
        expect(cards.count()).toBe(2); // 2 because 1 option + "not selected" option = 2.
        expect(cards.get(1).getText()).toBe('XXXX XXXX XXXX 6789');

        expect(element(by.id('payment_method')).$('option:checked').getText()).toBe('XXXX XXXX XXXX 6789');
    });

    it('should show the payment card logo and expiry date', function() {
        expect(element(by.css('.mastercard')).isDisplayed()).toBe(true);
        expect(element(by.css('.visa')).isDisplayed()).toBe(false);
        expect(element(by.css('.amex')).isDisplayed()).toBe(false);
        expect(element(by.css('.maestro')).isDisplayed()).toBe(false);

        expect(element(by.css('.payment-method-info')).isDisplayed()).toBe(true);
        expect(element(by.css('.payment-method-info')).getText()).toContain('11/2016');
    });

    it('should show the billing address', function() {
        var billingAddress = element(by.css(''));
        expect(billingAddress.getText()).toContain('Mega Things Ltd');
        expect(billingAddress.getText()).toContain('25 Lena Gardens');
        expect(billingAddress.getText()).toContain('London');
        expect(billingAddress.getText()).toContain('W6 7PY');
    });

    it('should be able to proceed to the "Thank you" page', function() {
        element(by.css('. input[type="submit"]')).click();

        expect(browser.getCurrentUrl()).toMatch(/citypantry\.dev\/admin\/meal-plan\/customer\/[0-9a-f]{24}\/thank-you$/);
    });
});
