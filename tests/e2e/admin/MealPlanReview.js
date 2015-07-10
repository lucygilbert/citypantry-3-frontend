// @todo - fix the disabled tests.

describe('Admin - meal plan review', function() {
    var isFirst = true;
    var mealPlanOrders;
    var notificationModal = require('../NotificationModal.js');
    var gridTestUtils = require('../lib/gridTestUtils.spec.js');

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');

            browser.get('/admin/meal-plan');
            gridTestUtils.enterFilterInColumn('meal-plan-table', 2, 'Active');

            element.all(by.css('.view-all-meal-plans')).first().click();
            expect(browser.getCurrentUrl()).toMatch(/\/admin\/meal-plan\/customer\/[0-9a-f]{24}\/meal-plans$/);

            element(by.css('.cp-review-and-send-to-customer')).click();
            expect(browser.getCurrentUrl()).toMatch(/\/admin\/meal-plan\/customer\/[0-9a-f]{24}\/meal-plan\/[0-9a-f]{24}\/review$/);

            mealPlanOrders = element.all(by.css('.cp-meal-plan-review-order'));

            isFirst = false;
        }
    });

    it('should show the meal plan duration, order count and total amount', function() {
        var titleText = element(by.css('h1')).getText();
        expect(titleText).toContain('ONE MONTH MEAL PLAN');
        expect(titleText).toMatch(/\d MEALS/);
        expect(titleText).toMatch(/£[\d,\.]+/);
    });

    it('should show the delivery address', function() {
        expect(element(by.css('.cp-meal-plan-review-delivery-address')).getText())
            .toContain('Delivery address: 235 Regent Street');
    });

    it('show show the meal plan orders', function() {
        expect(mealPlanOrders.count()).toBe(2);
    });

    xit('should select the first meal plan order by default', function() {
        var selectedOrder = element(by.css('.cp-meal-plan-review-order.selected'));
        expect(selectedOrder.getText()).toContain('THU');
        expect(selectedOrder.getText()).toContain('21/05');
        expect(selectedOrder.getText()).toContain('Marshmallows');
        expect(selectedOrder.getText()).toContain('Hong Tin');
    });

    xit('should show the selected meal plan order', function() {
        expect(element(by.css('.cp-meal-plan-review-aside')).isPresent()).toBe(true);
        expect(element(by.css('.cp-meal-plan-review-aside-order-date')).getText()).toMatch(/\w{3}, \d{2}\/\d{2}\/\d{2}/);
        expect(element(by.css('.cp-package-card-name')).getText()).toBe('MARSHMALLOWS');
        expect(element(by.css('.cp-package-card-vendor')).getText()).toBe('Hong Tin');
        expect(element(by.css('.cp-package-card-price')).getText()).toContain('£7.30');
        expect(element(by.css('.cp-meal-plan-review-aside-package-description')).getText()).toBe('Yum');
        expect(element(by.css('.cp-order-details-delivery-time'))).toMatch(/([01]\d|2[0-3]):([0-5]\d)/);
        expect(element(by.css('.cp-order-details-head-count'))).toBe('10');
        expect(element(by.css('.cp-order-details-dietary-requirements'))).toBe('None');
        expect(element.all(by.css('.cp-order-details-total')).get(1).getText()).toContain('67.78');

        mealPlanOrders.get(1).click();

        expect(element(by.css('.cp-package-card-name')).getText()).toBe('PAELLA');
        expect(element(by.css('.cp-package-card-vendor')).getText()).toBe('Flame Mangal');
        expect(element(by.css('.cp-package-card-price')).getText()).toContain('£10.00');
        expect(element(by.css('.cp-meal-plan-review-aside-package-description')).getText()).toBe('Yummy');
        expect(element(by.css('.cp-order-details-head-count'))).toBe('15');
        expect(element(by.css('.cp-order-details-dietary-requirements'))).toBe('None');
        expect(element.all(by.css('.cp-order-details-total')).get(1).getText()).toContain('127.50');

        // Revert the changes so other tests will pass.
        mealPlanOrders.get(0).click();
    });

    xit('should be able to replace a package with a random unused alternative', function() {
        var replacePackageButton = element(by.css('button[ng-click="replaceWithRandomUnusedPackage()"]'));
        expect(replacePackageButton.getText()).toBe('Replace with random unused package');
        replacePackageButton.click();
    });

    it('should be able to replace a package with a specific alternative package', function() {
        var replacePackageButton = element(by.css('button[ng-click="replaceWithSpecificPackage()"]'));
        expect(replacePackageButton.getText()).toBe('Replace with specific package');
        replacePackageButton.click();

        expect(browser.getCurrentUrl()).toMatch(/\/admin\/meal-plan\/customer\/[a-f0-9]{24}\/meal-plan\/[a-f0-9]{24}\/replace-package\/2016-05-23T13:30:00\+01:00$/);
        browser.navigate().back();
    });

    xit('should be able to send the meal plan to the customer', function() {
        var sendToCustomerButton = element(by.css('button[ng-click="send()"]'));
        sendToCustomerButton.click();

        notificationModal.expectIsOpen();
        notificationModal.expectSuccessHeader();
        notificationModal.expectMessage('');
        notificationModal.dismiss();
    });
});
