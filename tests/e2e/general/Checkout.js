describe('Checkout', function() {
    var now = new Date();
    var oneWeekFromNow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);

    if (oneWeekFromNow.getDay() === 0) {
        oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 1);
    }

    function changeDeliveryLocation(postcode) {
        element(by.css('.cp-package-change-delivery-location')).click();
        element(by.model('$parent.newPostcode')).sendKeys(postcode);
        element(by.css('.cp-modal button[type="submit"]')).click();

        expect(element(by.css('.cp-modal-title')).getText()).toBe('AVAILABLE');
        expect(element(by.id('order_postcode')).getAttribute('value')).toBe(postcode);

        element(by.css('.cp-modal .close')).click();
    }

    function pickPackageFromSearch() {
        var breakfastEventType = element.all(by.repeater('eventType in eventTypes')).get(0);
        expect(breakfastEventType.getText()).toBe('Breakfast');
        breakfastEventType.click();
        expect(element.all(by.repeater('package in packages')).count()).toBe(1);

        element.all(by.repeater('package in packages')).get(0).all(by.css('a')).get(0).click();
    }

    function expectAbleToPlaceOrderSuccessfully() {
        element(by.css('.cp-checkout-payment-form input[type="submit"]')).click();
        expect(browser.getCurrentUrl()).toMatch(/citypantry\.dev\/checkout\/thank-you/);
        expect(element(by.css('.cp-checkout-thank-you')).getText())
            .toContain('YOU JUST COMPLETED YOUR CHECKOUT PROCESS');
    }

    describe('Address and card saved', function() {
        var isFirst = true;

        beforeEach(function() {
            if (isFirst) {
                loginAsUser('customer@bunnies.test');
                browser.get('/search');

                pickPackageFromSearch();

                changeDeliveryLocation('W6 7PY');

                // Select delivery date and time and head count.
                element(by.model('pickedDate')).sendKeys(oneWeekFromNow.toISOString());
                element.all(by.css('#order_time > option')).get(31).click(); // 13:30
                element(by.model('order.headCount')).sendKeys(30);

                element(by.css('.cp-package-form input[type="submit"]')).click();

                isFirst = false;
            }
        });

        it('should highlight the "catering details" step', function() {
            expect(element(by.css('.cp-checkout-steps > .active')).getText()).toBe('Catering details');
        });

        it('should show the order details', function() {
            expect(element(by.css('.cp-package-card-name')).getText()).toBe('CARROTS');
            expect(element(by.css('.cp-package-card-vendor')).getText()).toBe('Hong Tin');
            expect(element(by.id('delivery_location')).getText()).toBe('W6 7PY');
            expect(element(by.id('delivery_date')).getText()).toMatch(/\d{2}\/\d{2}\/\d{2} ([01]\d|2[0-3]):([0-5]\d)/);
            expect(element(by.id('head_count')).getText()).toBe('30');
            expect(element(by.id('sub_total_amount')).getText()).toContain('600.00');
            expect(element(by.id('delivery_cost')).isPresent()).toBe(false);
            expect(element(by.id('free_delivery')).isPresent()).toBe(true);
            expect(element(by.id('total_amount')).getText()).toContain('600.00');
        });

        it('should show the vegetarian head count options', function() {
            var options = element.all(by.css('#vegetarian_head_count > option'));
            expect(options.count()).toBe(32); // 32 because 0-30 options + "not selected" option = 32.
        });

        it('should not present "packaging options"', function() {
            expect(element(by.model('order.packagingType')).isPresent()).toBe(false);
            expect(element(by.model('order.isCutleryAndServiettesRequired')).isPresent()).toBe(false);
        });

        it('should not present "extra service"', function() {
            expect(element(by.model('order.isVendorRequiredToSetUp')).isPresent()).toBe(false);
            expect(element(by.model('order.isVendorRequiredToCleanUp')).isPresent()).toBe(false);
        });

        it('should be able to proceed to the "delivery details" step', function() {
            element(by.model('order.vegetarianHeadCount')).sendKeys('5');
            element(by.model('order.dietaryRequirementsExtra')).sendKeys('No nuts in food.');

            element(by.css('.cp-checkout-form input[type="submit"]')).click();

            expect(browser.getCurrentUrl()).toMatch(/citypantry\.dev\/checkout\/delivery-details/);
        });

        it('should highlight the "delivery details" step', function() {
            expect(element(by.css('.cp-checkout-steps > .active')).getText()).toBe('Delivery details');
        });

        it('should load the customer\'s saved address', function() {
            expect(element(by.css('.cp-checkout-address')).getText()).toContain('25 Lena Gardens');
            expect(element(by.model('address.officeManagerName')).getAttribute('value')).toBe('Bunny Rabbit');
            expect(element(by.model('address.landlineNumber')).getAttribute('value')).toBe('02012345678');
            expect(element(by.model('address.deliveryInstruction')).getAttribute('value')).toBe('Ask for someone');
            expect(element(by.model('address.parkingSuggestion')).getAttribute('value')).toBe('Paint your car invisible so traffic wardens can\'t see it');
        });

        it('should be able to proceed to the "payment" step', function() {
            element(by.css('button[ng-click="nextStep()"]')).click();

            expect(browser.getCurrentUrl()).toMatch(/citypantry\.dev\/checkout\/payment/);
        });

        it('should highlight the "payment" step', function() {
            expect(element(by.css('.cp-checkout-steps > .active')).getText()).toBe('Payment');
        });

        it('should load the customer\'s cards and select the first by default', function() {
            expect(element.all(by.css('#payment_method > option')).count()).toBe(2); // 2 because 1 option + "not selected" option = 2.
            expect(element.all(by.css('#payment_method > option')).get(1).getText()).toBe('XXXX XXXX XXXX 6789');

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

        it('should show an error if promo code does not exist', function() {
            var promoCodeButton = element(by.cssContainingText('button', 'Promo code?'));
            promoCodeButton.click();
            expect(element(by.id('promo_code')).isPresent()).toBe(true);

            element(by.model('order.promoCode')).sendKeys('NOT_A_REAL_CODE');
            element(by.css('button[ng-click="submitPromoCode()"]')).click();

            var error = element(by.css('label[for="promo_code"] > .form-element-invalid'));
            expect(error.isDisplayed()).toBe(true);
            expect(error.getText()).toBe('No promo code exists with the code NOT_A_REAL_CODE');

            // Revert the changes so other tests will pass.
            element(by.model('order.promoCode')).clear();
        });

        it('should show an error if promo code has expired', function() {
            element(by.model('order.promoCode')).sendKeys('EXPIRED');
            element(by.css('button[ng-click="submitPromoCode()"]')).click();

            var error = element(by.css('label[for="promo_code"] > .form-element-invalid'));
            expect(error.isDisplayed()).toBe(true);
            expect(error.getText()).toBe('Promo code EXPIRED has expired');

            // Revert the changes so other tests will pass.
            element(by.model('order.promoCode')).clear();
        });

        it('should be able to redeem a promo code', function() {
            element(by.model('order.promoCode')).sendKeys('TEST');
            element(by.css('button[ng-click="submitPromoCode()"]')).click();

            expect(element(by.css('.cp-checkout-promo-code-valid')).getText()).toContain('TEST');
            expect(element(by.css('.cp-checkout-promo-code-valid')).getText()).toContain('5.22');
            expect(element(by.css('.cp-checkout-payment-form input[type="submit"]')).getAttribute('value')).toContain('594.78');
        });

        it('should be able to proceed to the "thank you" page', expectAbleToPlaceOrderSuccessfully);
    });

    describe('New address and card', function() {
        var isFirst = true;

        beforeEach(function() {
            if (isFirst) {
                browser.get('/search');

                pickPackageFromSearch();

                changeDeliveryLocation('W12 8LB');

                // Select delivery date and time and head count.
                element(by.model('pickedDate')).sendKeys(oneWeekFromNow.toISOString());
                element.all(by.css('#order_time > option')).get(31).click(); // 13:30
                element(by.model('order.headCount')).sendKeys(30);

                element(by.css('.cp-package-form input[type="submit"]')).click();

                isFirst = false;
            }
        });

        it('should be able to proceed to the "delivery details" step', function() {
            element(by.model('order.vegetarianHeadCount')).sendKeys('5');
            element(by.model('order.dietaryRequirementsExtra')).sendKeys('No nuts in food.');

            element(by.css('.cp-checkout-form input[type="submit"]')).click();

            expect(browser.getCurrentUrl()).toMatch(/citypantry\.dev\/checkout\/delivery-details/);
        });

        it('should prefill the postcode in the "delivery address" form', function() {
            expect(element(by.model('address.postcode')).getAttribute('value')).toBe('W12 8LB');
        });

        it('should be able to fill in the "delivery address" form', function() {
            element(by.model('address.companyName')).sendKeys('Shepherds Bush Rail Station');
            element(by.model('address.addressLine1')).sendKeys('Holland Park Roundabout');
            element(by.model('address.addressLine2')).sendKeys('Uxbridge Road');
            element(by.model('address.addressLine3')).sendKeys('Shepherds Bush');
            element(by.model('address.city')).sendKeys('London');
            element(by.model('address.officeManagerName')).sendKeys('Sophie Stevenson');
            element(by.model('address.landlineNumber')).sendKeys('0845 748 4950');
        });

        it('should be able to proceed to the "payment" step', function() {
            element(by.css('button[ng-click="nextStep()"]')).click();

            expect(browser.getCurrentUrl()).toMatch(/citypantry\.dev\/checkout\/payment/);
        });

        it('should be able to add a new card', function() {
            element.all(by.css('#payment_method > option')).get(0).click();
            expect(element(by.model('card.number')).isPresent()).toBe(true);
            expect(element(by.model('card.expirationMonth')).isPresent()).toBe(true);
            expect(element(by.model('card.expirationYear')).isPresent()).toBe(true);
            expect(element(by.model('card.cvc')).isPresent()).toBe(true);
        });

        it('should show the payment card logos', function() {
            expect(element(by.css('.visa')).isDisplayed()).toBe(true);
            expect(element(by.css('.amex')).isDisplayed()).toBe(true);
            expect(element(by.css('.mastercard')).isDisplayed()).toBe(true);
            expect(element(by.css('.maestro')).isDisplayed()).toBe(true);

            expect(element(by.css('.payment-method-info')).isDisplayed()).toBe(false);
        });

        it('should be able to fill in the "payment card" form', function() {
            element(by.model('card.number')).sendKeys('4111 1111 1111 1111');
            element.all(by.css('#card_expiry_month > option')).get(1).click();
            element.all(by.css('#card_expiry_year > option')).get(2).click();
            element(by.model('card.cvc')).sendKeys('123');
        });

        it('should be able to proceed to the "thank you" page', expectAbleToPlaceOrderSuccessfully);
    });
});
