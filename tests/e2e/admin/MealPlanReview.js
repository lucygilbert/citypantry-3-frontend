describe('Admin - meal plan review', function() {
    var isFirst = true;
    var mealPlanOrders;
    var notificationModal = require('../NotificationModal.js');

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/meal-plan');
            // @todo
            isFirst = false;
        }

        mealPlanOrders = element.all(by.css('.cp-meal-plan-review-order'));
    });

    it('should show the meal plan duration, order count and total amount', function() {
        expect(element(by.css('h1')).getText()).toBe('X MEAL PLAN 4 MEALS X');
    });

    it('should show the delivery address', function() {
        expect(element(by.css('.cp-meal-plan-review-delivery-address')).getText()).toBe('Delivery address: x');
    });

    it('show show the meal plan orders', function() {
        expect(mealPlanOrders.count()).toBe(4);

        expect(mealPlanOrders.get(0).getText()).toContain('THU');
        expect(mealPlanOrders.get(0).getText()).toContain('21/05');
        expect(mealPlanOrders.get(0).getText()).toContain('MARSHMALLOWS');
        expect(mealPlanOrders.get(0).getText()).toContain('Hong Tin');

        expect(mealPlanOrders.get(1).getText()).toContain('THU');
        expect(mealPlanOrders.get(1).getText()).toContain('21/05');
        expect(mealPlanOrders.get(1).getText()).toContain('PAELLA');
        expect(mealPlanOrders.get(1).getText()).toContain('Flame Mangal');
    });

    it('should select the first meal plan order by default', function() {
        var selectedOrder = element(by.css('.cp-meal-plan-review-order.selected'));
        expect(selectedOrder.getText()).toContain('THU');
        expect(selectedOrder.getText()).toContain('21/05');
        expect(selectedOrder.getText()).toContain('Marshmallows');
        expect(selectedOrder.getText()).toContain('Hong Tin');
    });

    it('should show the selected meal plan order', function() {
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

    it('should be able to replace a package', function() {
        var replacePackageButton = element(by.css('button[ng-click="replace()"]'));
        replacePackageButton.click();

        expect(mealPlanOrders.get(0).getText()).toContain('THU');
        expect(mealPlanOrders.get(0).getText()).toContain('21/05');
        expect(mealPlanOrders.get(0).getText()).not.toContain('MARSHMALLOWS');
        expect(mealPlanOrders.get(0).getText()).not.toContain('Hong Tin');
    });

    it('should be able to send the meal plan to the customer', function() {
        var sendToCustomerButton = element(by.css('button[ng-click="send()"]'));
        sendToCustomerButton.click();

        notificationModal.expectIsOpen();
        notificationModal.expectSuccessHeader();
        notificationModal.expectMessage('');
        notificationModal.dismiss();
    });
});
