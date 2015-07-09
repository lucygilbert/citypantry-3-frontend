describe('Package page', function() {
    function clickOrderNowButton() {
        var orderNowButton = element(by.css('.cp-btn-start-order'));
        expect(orderNowButton.getAttribute('value')).toMatch(/Order now \(£[\d\.,]+\)/);
        orderNowButton.click();
    }

    function enterPostcode(postcode) {
        element(by.css('.cp-package-change-delivery-location')).click();
        element(by.model('$parent.newPostcode')).sendKeys(postcode);
        element(by.css('.cp-delivery-location-modal button[type="submit"]')).click();
    }

    function closePostcodeModal() {
        element(by.css('.cp-delivery-location-modal .close')).click();
    }

    describe('Carrots package', function() {
        var now = new Date();
        var nextSunday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (7 - now.getDay()));
        var oneWeekFromNow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);

        if (oneWeekFromNow.getDay() === 0) {
            oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 1);
        }

        it('should show the login modal if Order Now is clicked when logged out', function() {
            logout();
            browser.get('/search');

            var breakfastEventType = element.all(by.repeater('eventType in eventTypes')).get(0);
            expect(breakfastEventType.getText()).toBe('Breakfast');
            breakfastEventType.click();
            expect(element.all(by.repeater('package in packages')).count()).toBe(1);

            element.all(by.repeater('package in packages')).get(0).all(by.css('a')).get(0).click();

            var loginModal = element(by.css('.cp-login'));
            var deliveryLocationError = element(by.css('label[for="order_postcode"] .form-element-invalid'));

            expect(loginModal.isPresent()).toBe(false);
            expect(deliveryLocationError.isDisplayed()).toBe(false);

            clickOrderNowButton();

            // The login modal should not be visible yet because the required fields have not been
            // completed.
            expect(loginModal.isPresent()).toBe(false);
            expect(deliveryLocationError.isDisplayed()).toBe(true);

            enterPostcode('W6 7PY');
            closePostcodeModal();
            element(by.model('pickedDate')).clear().sendKeys(oneWeekFromNow.toISOString());
            element(by.cssContainingText('#order_time option', '13:30')).click();
            element(by.model('order.headCount'))
                .element(by.cssContainingText('option', '100'))
                .click();

            clickOrderNowButton();

            // Now the login modal should be visible yet because the required fields have been
            // completed.
            expect(loginModal.isDisplayed()).toBe(true);
            expect(deliveryLocationError.isDisplayed()).toBe(false);
        });

        it('has the package', function() {
            loginAsUser('customer@bunnies.test');
            browser.get('/search');

            var breakfastEventType = element.all(by.repeater('eventType in eventTypes')).get(0);
            expect(breakfastEventType.getText()).toBe('Breakfast');
            breakfastEventType.click();
            expect(element.all(by.repeater('package in packages')).count()).toBe(1);

            element.all(by.repeater('package in packages')).get(0).all(by.css('a')).get(0).click();
        });

        it('should show the package title', function() {
            expect(element(by.css('h1.cp-package-name')).getText()).toBe('CARROTS');
        });

        it('should load the package details', function() {
            expect(element(by.css('.cp-package-description')).getText()).toBe('Yum');

            var items = element.all(by.repeater('item in package.items'));
            expect(items.get(0).getText()).toBe('Orange carrots');
            expect(items.get(1).getText()).toBe('White carrots');

            var allergenTypes = element.all(by.repeater('allergen in package.allergenTypes'));
            expect(allergenTypes.get(0).getText()).toBe('Sulphur dioxide, which is a preservative found in some dried fruit');

            var dietaryRequirements = element.all(by.repeater('requirement in package.dietaryRequirements'));
            expect(dietaryRequirements.get(0).getText()).toBe('VEGETARIAN');
            expect(dietaryRequirements.get(1).getText()).toBe('VEGAN');

            // Chrismas should not show because it is not an active event type.
            var eventTypes = element.all(by.repeater('event in package.eventTypes'));
            expect(eventTypes.count()).toBe(1);
            expect(eventTypes.get(0).getText()).toBe('BREAKFAST');

            // 48 hours notice.
            expect(element(by.css('.cp-package-specification-notice')).getText()).toMatch('48H');

            // Should be cold food NOT hot food.
            expect(element(by.css('.cp-package-specification img[src*="hot"]')).isPresent()).toBe(false);
            expect(element(by.css('.cp-package-specification img[src*="cold"]')).isPresent()).toBe(true);

            // Should be individual NOT buffet.
            expect(element(by.css('.cp-package-specification img[src*="individual"]')).isPresent()).toBe(true);
            expect(element(by.css('.cp-package-specification img[src*="buffet"]')).isPresent()).toBe(false);

            expect(element(by.css('.cp-package-cost')).getText()).toMatch('£20.00');
        });

        it('should load the package images', function() {
            expect(element.all(by.repeater('image in package.images')).count()).toBe(2);
        });

        it('should show 3 reviews', function() {
            expect(element.all(by.css('.cp-package-review')).count()).toBe(3);
        });

        it('should show 6 reviews when \'more reviews\' is clicked', function() {
            var moreReviews = element(by.css('.cp-package-reviews-more'));

            expect(moreReviews.isPresent()).toBe(true);

            moreReviews.click();

            expect(element.all(by.css('.cp-package-review')).count()).toBe(6);
            expect(moreReviews.isPresent()).toBe(false);
        });

        it('should show similar packages', function() {
            expect(element.all(by.repeater('package in similarPackagesByDifferentVendors')).count()).toBe(1);
        });

        it('should load time options in 15 minute intervals', function() {
            var times = element.all(by.css('#order_time > option'));
            expect(times.count()).toBe(50);
            expect(times.get(1).getText()).toBe('06:00');
            expect(times.get(2).getText()).toBe('06:15');
            expect(times.get(3).getText()).toBe('06:30');
            expect(times.get(4).getText()).toBe('06:45');
            expect(times.get(5).getText()).toBe('07:00');
            expect(times.get(49).getText()).toBe('18:00');
        });

        it('should load people options and select the minimum number of people by default', function() {
            var people = element.all(by.css('#order_head_count > option'));
            expect(people.count()).toBe(250);
            expect(people.get(0).getText()).toBe('1');
            expect(people.get(249).getText()).toBe('250');

            expect(element(by.id('order_head_count')).$('option:checked').getText()).toBe('1');
        });

        it('should show an error if an invalid postcode is entered', function() {
            enterPostcode('QWERTY');

            var error = element.all(by.css('.cp-delivery-location-modal .cp-form-error')).get(1);
            expect(error.getText()).toBe('Postcode is invalid');
            expect(error.isDisplayed()).toBe(true);

            closePostcodeModal();
        });

        it('should be able to change delivery location', function() {
            enterPostcode('W12 8LB');

            expect(element(by.css('.cp-modal-title')).getText()).toBe('AVAILABLE');
            expect(element(by.id('order_postcode')).getAttribute('value')).toBe('W12 8LB');

            closePostcodeModal();
        });

        it('should show an error if the meal cannot be delivered to this postcode', function() {
            enterPostcode('EC1V 9NS');

            expect(element(by.css('.cp-modal-title')).getText()).toBe('NOT AVAILABLE');
            expect(element(by.id('order_postcode')).getAttribute('value')).toBe('W12 8LB');

            closePostcodeModal();
        });

        it('should show a date picker when delivery date is focused', function() {
            var datePicker = element(by.model('date'));

            expect(datePicker.isDisplayed()).toBe(false);
            element(by.model('pickedDate')).click();
            expect(datePicker.isDisplayed()).toBe(true);
        });

        it('should update the delivery cost when head count is changed', function() {
            var deliveryCost = element(by.css('.cp-package-delivery-cost'));

            expect(deliveryCost.getText()).toBe('Total price includes £15 delivery. FREE delivery when you spend £100 or more.');
            element(by.model('order.headCount')).sendKeys(10);
            expect(deliveryCost.getText()).toBe('You’ve qualified for FREE delivery!');
        });

        it('should show an error if the vendor does not deliver on this day', function() {
            element(by.model('pickedDate')).sendKeys(nextSunday.toISOString());
            element.all(by.css('#order_time > option')).get(21).click(); // 11:00.

            clickOrderNowButton();

            expect(element(by.css('p[ng-bind="packageFormError"]')).getText()).toBe('This meal cannot be delivered on this date.');
        });

        it('should show an error if the vendor needs more notice', function() {
            element(by.model('pickedDate')).clear().sendKeys(now.toISOString());

            clickOrderNowButton();

            expect(element(by.css('p[ng-bind="packageFormError"]')).getText()).toBe('The vendor needs more notice to deliver at this time.');
        });

        it('should be able to proceed to checkout', function() {
            element(by.model('pickedDate')).clear().sendKeys(oneWeekFromNow.toISOString());

            clickOrderNowButton();

            expect(browser.getCurrentUrl()).toMatch(/citypantry\.dev\/checkout\/catering-details/);
        });
    });
});
