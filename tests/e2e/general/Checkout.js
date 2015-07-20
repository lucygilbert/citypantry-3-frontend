describe('Checkout', function() {
    var now = new Date();
    var oneWeekFromNow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);

    if (oneWeekFromNow.getDay() === 0) {
        oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 1);
    }

    /**
     * Check the delivery postcode on the "view package" page.
     */
    function changeDeliveryLocation(postcode) {
        element(by.css('.cp-package-change-delivery-location')).click();
        element(by.model('$parent.newPostcode')).sendKeys(postcode);
        element(by.css('.cp-modal button[type="submit"]')).click();

        expect(element(by.css('.cp-modal-title')).getText()).toBe('AVAILABLE');
        expect(element(by.id('order_postcode')).getAttribute('value')).toBe(postcode);

        element(by.css('.cp-modal .close')).click();
    }

    /**
     * Click on the 'Breakfast' event type on the search page.
     */
    function pickBreakfastEventType() {
        var breakfastEventType = element.all(by.repeater('eventType in eventTypes')).get(0);
        expect(breakfastEventType.getText()).toBe('Breakfast');
        breakfastEventType.click();
    }

    /**
     * Assert that there is just one package result on the search page, and click on that package to
     * go to it's package page.
     */
    function pickSinglePackageResult() {
        var packages = element.all(by.repeater('package in packages'));
        expect(packages.count()).toBe(1);

        packages.get(0).all(by.css('a')).get(0).click();
    }

    function expectAbleToPlaceOrderSuccessfully() {
        element(by.css('.cp-checkout-payment-form input[type="submit"]')).click();
        expect(browser.getCurrentUrl()).toMatch(/citypantry\.dev\/checkout\/thank-you/);
        expect(element(by.css('.cp-checkout-thank-you')).getText())
            .toContain('YOU JUST COMPLETED YOUR CHECKOUT PROCESS');
    }

    function openPromoCodeField() {
        var promoCodeButton = element(by.cssContainingText('button', 'Promo code?'));
        promoCodeButton.click();
        expect(element(by.id('promo_code')).isDisplayed()).toBe(true);
    }

    function attemptToUsePromoCode(code)  {
        var codeField = element(by.model('order.promoCodeCode'));
        expect(codeField.isDisplayed()).toBe(true);

        codeField.clear();
        codeField.sendKeys(code);

        var submitButton = element(by.css('button[ng-click="submitPromoCode()"]'));
        expect(submitButton.getText()).toBe('Submit');
        submitButton.click();
    }

    function expectPromoCodeError(expectedErrorMessage) {
        var error = element(by.css('label[for="promo_code"] > .form-element-invalid'));
        expect(error.isDisplayed()).toBe(true);
        expect(error.getText()).toBe(expectedErrorMessage);
    }

    function expectNumberOfQuestions(expectedCount) {
        var questions = element.all(by.repeater('question in questions'));
        expect(questions.count()).toBe(expectedCount);
    }

    describe('without reaching the minimum order value', function() {
        var isFirst = true;

        beforeEach(function() {
            if (isFirst) {
                loginAsUser('customer@bunnies.test');
                browser.get('/search');

                pickBreakfastEventType();
                pickSinglePackageResult();

                changeDeliveryLocation('W6 7PY');

                // Select delivery date and time.
                element(by.model('pickedDate')).sendKeys(oneWeekFromNow.toISOString());
                element(by.cssContainingText('#order_time > option', '13:30')).click();
            }

            isFirst = false;
        });

        it('should default to a head count of 1, because that is the package\'s minimum head count', function() {
            var selectedHeadCount = element(by.model('order.headCount'))
                .element(by.css('option[selected="selected"]'));
            expect(selectedHeadCount.getText()).toBe('1');
        });

        it('should show an error that the order has not reached the minimum order value', function() {
            var submitButton = element(by.css('.cp-package-form input[type="submit"]'));
            expect(submitButton.getAttribute('value')).toContain('£35.00');
            submitButton.click();

            var error = element(by.css('[ng-show="packageFormError"]'));
            expect(error.isDisplayed()).toBe(true);
            expect(error.getText()).toBe('You have not met the minimum order value of £50.');
        });
    });

    describe('Address and card saved', function() {
        var isFirst = true;

        beforeEach(function() {
            if (isFirst) {
                loginAsUser('customer@bunnies.test');
                browser.get('/search');

                pickBreakfastEventType();
                pickSinglePackageResult();

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
            openPromoCodeField();

            attemptToUsePromoCode('NOT_A_REAL_CODE');

            expectPromoCodeError('No promo code exists with the code NOT_A_REAL_CODE');
        });

        it('should show an error if promo code has expired', function() {
            attemptToUsePromoCode('EXPIRED');

            expectPromoCodeError('Promo code EXPIRED has expired');
        });

        it('should show an error if the given promo code has already been used by this customer', function() {
            attemptToUsePromoCode('test');

            expectPromoCodeError('Promo code TEST has expired');
        });

        it('should be able to redeem a promo code', function() {
            // The promo code should be case-insensitive. Type it in differently from the database
            // to ensure case-insensitivity works.
            attemptToUsePromoCode('tEsT2');

            // The promo code should be displayed in all capitals, even if it was typed in the
            // wrong case.
            expect(element(by.css('.cp-checkout-promo-code-valid')).getText()).toContain('TEST2');
            expect(element(by.css('.cp-checkout-promo-code-valid')).getText()).toContain('£40.00');
            expect(element(by.css('.cp-checkout-payment-form input[type="submit"]')).getAttribute('value')).toContain('560');
        });

        it('should be able to proceed to the "thank you" page', expectAbleToPlaceOrderSuccessfully);
    });

    describe('New address and card', function() {
        var isFirst = true;

        beforeEach(function() {
            if (isFirst) {
                browser.get('/search');

                pickBreakfastEventType();
                pickSinglePackageResult();

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

    describe('with a new address and 100% discount so no payment details are needed', function() {
        var isFirst = true;

        beforeEach(function() {
            if (isFirst) {
                loginAsUser('james@mi6.test');
                browser.get('/search');

                pickBreakfastEventType();
                pickSinglePackageResult();

                changeDeliveryLocation('SE1 7TP');

                // Select delivery date and time and head count.
                element(by.model('pickedDate')).sendKeys(oneWeekFromNow.toISOString());
                element(by.cssContainingText('#order_time option', '13:30')).click();
                element(by.model('order.headCount')).sendKeys(30);

                element(by.css('.cp-package-form input[type="submit"]')).click();

                isFirst = false;
            }
        });

        it('should be able to proceed to the "delivery details" step', function() {
            element(by.model('order.vegetarianHeadCount')).sendKeys('5');
            element(by.model('order.dietaryRequirementsExtra')).sendKeys('No poison in food.');

            element(by.css('.cp-checkout-form input[type="submit"]')).click();

            expect(browser.getCurrentUrl()).toMatch(/citypantry\.dev\/checkout\/delivery-details/);
        });

        it('should prefill the postcode in the "delivery address" form', function() {
            expect(element(by.model('address.postcode')).getAttribute('value')).toBe('SE1 7TP');
        });

        it('should be able to fill in the "delivery address" form', function() {
            element(by.model('address.companyName')).sendKeys('The Secret Service');
            element(by.model('address.addressLine1')).sendKeys('85 Albert Embankment');
            element(by.model('address.city')).sendKeys('London');
            element(by.model('address.officeManagerName')).sendKeys('M');
            element(by.model('address.landlineNumber')).sendKeys('999');
        });

        it('should be able to proceed to the "payment" step', function() {
            element(by.css('button[ng-click="nextStep()"]')).click();

            expect(browser.getCurrentUrl()).toMatch(/citypantry\.dev\/checkout\/payment/);
        });

        it('should be able to redeem a 100% referral promo code', function() {
            openPromoCodeField();

            attemptToUsePromoCode('ONUS');

            var promoCodeText = element(by.css('.cp-checkout-promo-code-valid')).getText();
            expect(promoCodeText).toContain('ONUS');
            expect(promoCodeText).toContain('100%');

            // Non-referral promo codes should not show questions.
            expectNumberOfQuestions(0);

            expect(element(by.css('.cp-checkout-payment-form input[type="submit"]')).getAttribute('value'))
                .toContain('Pay now (£0.00)');
        });

        it('should hide the payment details form fields', function() {
            expect(element(by.css('.cp-order-payment-type-choice')).isPresent()).toBe(false);
            expect(element(by.css('.cp-checkout-payment-card')).isPresent()).toBe(false);
            expect(element(by.css('.cp-order-pay-on-account-details')).isPresent()).toBe(false);
        });

        it('should be able to proceed to the "thank you" page', expectAbleToPlaceOrderSuccessfully);
    });

    describe('As a premium customer', function() {
        var isFirst = true;

        beforeEach(function() {
            if (isFirst) {
                loginAsUser('customer@apple.test');
                browser.get('/search');

                // 'Golden Apples' is a package only visible to this customer. It should be
                // visibile in the search results.
                element(by.css('.cp-search-advanced-search')).click();
                element(by.model('search.name')).sendKeys('golden apples');

                pickSinglePackageResult();

                changeDeliveryLocation('W1B 2EL');

                // Select delivery date and time and head count.
                element(by.model('pickedDate')).sendKeys(oneWeekFromNow.toISOString());
                element(by.cssContainingText('#order_time option', '12:00')).click();
                element(by.model('order.headCount')).sendKeys(30);

                element(by.css('.cp-package-form input[type="submit"]')).click();

                isFirst = false;
            }
        });

        it('should be able to proceed to the "delivery details" step', function() {
            element(by.model('order.vegetarianHeadCount')).sendKeys('5');
            element(by.model('order.dietaryRequirementsExtra')).sendKeys('No bananas in food.');

            element(by.css('.cp-checkout-form input[type="submit"]')).click();

            expect(browser.getCurrentUrl()).toMatch(/citypantry\.dev\/checkout\/delivery-details/);
        });

        it('should load the customer\'s saved address', function() {
            expect(element(by.css('.cp-checkout-address')).getText()).toContain('Regent St');
            expect(element(by.model('address.officeManagerName')).getAttribute('value')).toBe('Steve Jobs');
            expect(element(by.model('address.parkingSuggestion')).getAttribute('value')).toBe('It\'s Oxford Stret, good luck.');

            // The phone number is required but not set in the fixtures.
            element(by.model('address.landlineNumber')).sendKeys('123');
        });

        it('should be able to proceed to the "payment" step', function() {
            element(by.css('button[ng-click="nextStep()"]')).click();
            expect(browser.getCurrentUrl()).toMatch(/citypantry\.dev\/checkout\/payment/);
        });

        it('should default to paying on account for premium customers', function() {
            var paymentMethods = element.all(by.model('order.isPayOnAccount'));
            expect(paymentMethods.count()).toBe(2);

            var payOnAccountOptions = element(by.css('.cp-order-pay-on-account-details'));
            expect(payOnAccountOptions.isDisplayed()).toBe(true);
        });

        it('should be able to redeem a referral promo code', function() {
            openPromoCodeField();

            // The promo code should be case-insensitive. Type it in differently from the database
            // to ensure case-insensitivity works.
            attemptToUsePromoCode('refer-cuSTOMERATBUNNIES');

            var promoCodeText = element(by.css('.cp-checkout-promo-code-valid')).getText();
            // The promo code should be displayed in all capitals, even if it was typed in the
            // wrong case.
            expect(promoCodeText).toContain('REFER-CUSTOMERATBUNNIES');
            expect(promoCodeText).toContain('10%');
            expect(promoCodeText).toContain('Save £12.30');

            // Referral promo codes should show questions.
            expectNumberOfQuestions(2);

            expect(element(by.css('.cp-checkout-payment-form input[type="submit"]')).getAttribute('value'))
                .toContain('Pay now (£110.70)');
        });

        it('should be able to proceed to the "thank you" page', expectAbleToPlaceOrderSuccessfully);
    });
});
