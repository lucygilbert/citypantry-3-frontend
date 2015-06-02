var gridTestUtils = require('../lib/gridTestUtils.spec.js');
var notificationModal = require('../NotificationModal.js');

// @todo - fix these tests.
xdescribe('Admin - Meal plan setup', function() {
    var now = new Date();
    var oneWeekFromNow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);

    describe('Saved address', function() {
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

        it('should highlight the "meal preferences" step', function() {
            expect(element(by.css('.cp-meal-plan-setup-steps > .active')).getText()).toBe('Meal preferences');
        });

        it('should load event types', function() {
            var eventTypes = element.all(by.css('#event_type > option'));
            expect(eventTypes.count()).toBe(7); // 7 because 6 options + "not selected" option = 7.
            expect(eventTypes.get(1).getText()).toBe('Breakfast');
            expect(eventTypes.get(2).getText()).toBe('Lunch');
        });

        it('should load cuisine types', function() {
            var cuisineTypes = element.all(by.repeater('cuisineType in cuisineTypes'));
            expect(cuisineTypes.count()).toBe(31);
            expect(cuisineTypes.get(0).getText()).toBe('American');
            expect(cuisineTypes.get(1).getText()).toBe('Argentinian');
        });

        it('should load dietary requirements', function() {
            var addMoreButton = element(by.css('.cp-dietary-requirements-form-requirements-add'));
            addMoreButton.click();

            var dietaryRequirements = element.all(by.css('#dietary_requirement0_diet1 > option'));
            expect(dietaryRequirements.count()).toBe(8); // 8 because 7 options + "not selected" option = 8.
            expect(dietaryRequirements.get(1).getText()).toBe('Vegetarian');
            expect(dietaryRequirements.get(2).getText()).toBe('Vegan');
        });

        it('should be able to proceed to the "delivery details" step', function() {
            element.all(by.css('.cp-meal-plan-setup-day-of-the-week')).first().click();
            element.all(by.css('input[name="duration"]')).first().click();
            element(by.model('pickedDate')).sendKeys(oneWeekFromNow.toISOString());
            element.all(by.css('input[name="isToBeCateredOnBankHolidays"]')).first().click();
            element(by.model('preferences.eventType')).sendKeys('Lunch');
            element(by.model('preferences.time')).sendKeys(1330);
            element(by.model('preferences.headCount')).sendKeys(30);
            element(by.css('#dietary_requirement0_head_count')).sendKeys(5);
            element(by.css('#dietary_requirement0_diet1')).sendKeys('Vegetarian');

            element(by.css('.cp-meal-plan-setup-form input[type="submit"]')).click();

            expect(browser.getCurrentUrl()).toMatch(/citypantry\.dev\/admin\/meal-plan\/customer\/[0-9a-f]{24}\/setup\/delivery-details$/);
        });

        it('should highlight the "delivery details" step', function() {
            expect(element(by.css('.cp-meal-plan-setup-steps > .active')).getText()).toBe('Delivery details');
        });

        it('should load the customer\'s saved addresses', function() {
            var addresses = element.all(by.css('#saved_addresses > option'));
            expect(addresses.count()).toBe(2); // 2 because 1 option + "not selected" option = 2.
            expect(addresses.get(1).getText()).toBe('Lena Gardens');
        });

        it('should be able to select the customer\'s saved address', function() {
            element(by.cssContainingText('option', 'Lena Gardens')).click();

            expect(element(by.model('address.officeManagerName')).getAttribute('value')).toBe('Bunny Rabbit');
            expect(element(by.model('address.landlineNumber')).getAttribute('value')).toBe('02012345678');
            expect(element(by.model('address.deliveryInstruction')).getAttribute('value')).toBe('Ask for someone');
            expect(element(by.model('address.parkingSuggestion')).getAttribute('value')).toBe('Paint your car invisible so traffic wardens can\'t see it');
        });

        it('should be able to proceed to the "payment" step', function() {
            element(by.css('button[ng-click="nextStep()"]')).click();

            expect(browser.getCurrentUrl()).toMatch(/citypantry\.dev\/admin\/meal-plan\/customer\/[0-9a-f]{24}\/setup\/payment$/);
        });

        it('should be able to fill in the "billing address" form', function() {
            element(by.model('billingAddress.companyName')).sendKeys('Shepherds Bush Rail Station');
            element(by.model('billingAddress.addressLine1')).sendKeys('Holland Park Roundabout');
            element(by.model('billingAddress.addressLine2')).sendKeys('Uxbridge Road');
            element(by.model('billingAddress.addressLine3')).sendKeys('Shepherds Bush');
            element(by.model('billingAddress.city')).sendKeys('London');
            element(by.model('billingAddress.postcode')).sendKeys('W12 8LB');
        });

        it('should be able to proceed to the "meal plan dashboard" page', function() {
            element.all(by.css('input[name="paymentTerms"]')).first().click();

            element(by.css('.cp-meal-plan-setup-form input[type="submit"]')).click();

            expect(browser.getCurrentUrl()).toMatch(/citypantry\.dev\/admin\/meal-plan$/);
        });
    });

    describe('New address', function() {
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

        it('should be able to proceed to the "delivery details" step', function() {
            element.all(by.css('.cp-meal-plan-setup-day-of-the-week')).first().click();
            element.all(by.css('input[name="duration"]')).first().click();
            element(by.model('pickedDate')).sendKeys(oneWeekFromNow.toISOString());
            element.all(by.css('input[name="isToBeCateredOnBankHolidays"]')).first().click();
            element(by.model('preferences.eventType')).sendKeys('Lunch');
            element(by.model('preferences.time')).sendKeys(1330);
            element(by.model('preferences.headCount')).sendKeys(30);

            element(by.css('.cp-meal-plan-setup-form input[type="submit"]')).click();

            expect(browser.getCurrentUrl()).toMatch(/citypantry\.dev\/admin\/meal-plan\/customer\/[0-9a-f]{24}\/setup\/delivery-details$/);
        });

        it('should be able to fill in the "delivery address" form', function() {
            element(by.model('address.companyName')).sendKeys('Shepherds Bush Rail Station');
            element(by.model('address.addressLine1')).sendKeys('Holland Park Roundabout');
            element(by.model('address.addressLine2')).sendKeys('Uxbridge Road');
            element(by.model('address.addressLine3')).sendKeys('Shepherds Bush');
            element(by.model('address.city')).sendKeys('London');
            element(by.model('address.postcode')).sendKeys('W12 8LB');
            element(by.model('address.officeManagerName')).sendKeys('Sophie Stevenson');
            element(by.model('address.landlineNumber')).sendKeys('0845 748 4950');
        });

        it('should be able to proceed to the "payment" step', function() {
            element(by.css('button[ng-click="nextStep()"]')).click();

            expect(browser.getCurrentUrl()).toMatch(/citypantry\.dev\/admin\/meal-plan\/customer\/[0-9a-f]{24}\/setup\/payment$/);
        });

        it('should be able to fill in the "billing address" form', function() {
            element(by.model('billingAddress.companyName')).sendKeys('Shepherds Bush Rail Station');
            element(by.model('billingAddress.addressLine1')).sendKeys('Holland Park Roundabout');
            element(by.model('billingAddress.addressLine2')).sendKeys('Uxbridge Road');
            element(by.model('billingAddress.addressLine3')).sendKeys('Shepherds Bush');
            element(by.model('billingAddress.city')).sendKeys('London');
            element(by.model('billingAddress.postcode')).sendKeys('W12 8LB');
        });

        it('should be able to proceed to the "meal plan dashboard" page', function() {
            element.all(by.css('input[name="paymentTerms"]')).first().click();

            element(by.css('.cp-meal-plan-setup-form input[type="submit"]')).click();

            expect(browser.getCurrentUrl()).toMatch(/citypantry\.dev\/admin\/meal-plan$/);
        });
    });

    describe('Pay on account', function() {
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

        it('should be able to proceed to the "delivery details" step', function() {
            element.all(by.css('.cp-meal-plan-setup-day-of-the-week')).first().click();
            element.all(by.css('input[name="duration"]')).first().click();
            element(by.model('pickedDate')).sendKeys(oneWeekFromNow.toISOString());
            element.all(by.css('input[name="isToBeCateredOnBankHolidays"]')).first().click();
            element(by.model('preferences.eventType')).sendKeys('Lunch');
            element(by.model('preferences.time')).sendKeys(1330);
            element(by.model('preferences.headCount')).sendKeys(30);

            element(by.css('.cp-meal-plan-setup-form input[type="submit"]')).click();

            expect(browser.getCurrentUrl()).toMatch(/citypantry\.dev\/admin\/meal-plan\/customer\/[0-9a-f]{24}\/setup\/delivery-details$/);
        });

        it('should be able to proceed to the "payment" step', function() {
            element(by.cssContainingText('option', 'Lena Gardens')).click();

            element(by.css('button[ng-click="nextStep()"]')).click();

            expect(browser.getCurrentUrl()).toMatch(/citypantry\.dev\/admin\/meal-plan\/customer\/[0-9a-f]{24}\/setup\/payment$/);
        });

        it('should be able to fill in the "pay on account" form', function() {
            element.all(by.css('input[name="isPayOnAccount"]')).get(1).click();

            element(by.model('preferences.accountsContactName')).sendKeys('Accounts Department');
            element(by.model('preferences.accountsEmail')).sendKeys('accounts@citypantry.com');
            element(by.model('preferences.accountsTelephoneNumber')).sendKeys('020 3397 8376');
            element(by.model('preferences.invoicePaymentTerms')).sendKeys('Net 30');
            element(by.model('preferences.maxSpendPerMonth')).sendKeys(5000);
        });

        it('should be able to fill in the "billing address" form', function() {
            element(by.model('billingAddress.companyName')).sendKeys('Shepherds Bush Rail Station');
            element(by.model('billingAddress.addressLine1')).sendKeys('Holland Park Roundabout');
            element(by.model('billingAddress.addressLine2')).sendKeys('Uxbridge Road');
            element(by.model('billingAddress.addressLine3')).sendKeys('Shepherds Bush');
            element(by.model('billingAddress.city')).sendKeys('London');
            element(by.model('billingAddress.postcode')).sendKeys('W12 8LB');
        });

        it('should be able to proceed to the "meal plan dashboard" page', function() {
            element(by.css('.cp-meal-plan-setup-form input[type="submit"]')).click();

            expect(browser.getCurrentUrl()).toMatch(/citypantry\.dev\/admin\/meal-plan$/);
        });
    });
});
