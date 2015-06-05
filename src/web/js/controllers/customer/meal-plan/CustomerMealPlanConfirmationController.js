angular.module('cp.controllers.customer').controller('CustomerMealPlanConfirmationController',
        function($scope, $routeParams, $location, $q, DocumentTitleService, SecurityService,
        LoadingService, NotificationService, MealPlanFactory, CustomersFactory, UsersFactory,
        getCardNumberMaskFilter) {
    DocumentTitleService('Your meal plan');
    SecurityService.requireCustomer();

    const mealPlanId = $routeParams.mealPlanId;

    $scope.mealPlan = {};
    $scope.customer = {};

    $scope.paymentOptions = {
        // The card chosen to pay with. Ignored if `$scope.paymentOptions.isToBePaidOnAccount` is true.
        chosenCard: {},
        // Whether the order is to be paid on account. Defaults to true if the customer is able to
        // pay on account.
        isToBePaidOnAccount: false,
        // Whether the customer is allowed to pay on account.
        canPayOnAccount: false,
        departmentReference: null,
        purchaseOrderNumber: null,
        newCard: {}
    };

    $scope.isAmericanExpressVisible = true;
    $scope.isCardExpiryDateVisible = false;
    $scope.isMaestroVisible = true;
    $scope.isMastercardVisible = true;
    $scope.isVisaVisible = true;

    const thisYear = (new Date()).getFullYear();
    $scope.yearOptions = [];
    for (let year = thisYear; year < thisYear + 10; year += 1) {
        $scope.yearOptions.push({label: year, value: year});
    }

    $scope.monthOptions = [];
    for (let month = 1; month <= 12; month += 1) {
        $scope.monthOptions.push({label: ('0' + month).slice(-2), value: ('0' + month).slice(-2)});
    }

    const promise1 = SecurityService.getCustomer()
        .then((customer) => {
            $scope.customer = customer;
            $scope.paymentOptions.canPayOnAccount = customer.isPaidOnAccount;

            // If the customer can pay on account, default to that, because it is cheaper for us
            // (no card processing fees).
            if ($scope.paymentOptions.canPayOnAccount) {
                $scope.paymentOptions.isToBePaidOnAccount = true;
            }
        })
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));

    const promise2 = UsersFactory.getPaymentCards()
        .success(response => {
            $scope.cards = response.cards;
            $scope.cards.forEach(card => card.numberMasked = getCardNumberMaskFilter(card.last4, card.type));

            if ($scope.cards.length > 0) {
                $scope.paymentOptions.chosenCard = $scope.cards[0];
            }
        })
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));

    const promise3 = MealPlanFactory.getCustomerMealPlan('me', mealPlanId)
        .success(response => {
            if (response.mealPlan.statusText === 'active') {
                $location.path(`/customer/meal-plans/${mealPlanId}/success`);
                return;
            }

            $scope.mealPlan = response.mealPlan;

            const requirements = response.mealPlan.requirementsAtGeneration;
            $scope.paymentOptions.departmentReference = requirements.departmentReference;
            $scope.paymentOptions.purchaseOrderNumber = requirements.purchaseOrderNumber;
        })
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));

    $q.all([promise1, promise2, promise3]).then(() => LoadingService.hide());

    $scope.$watch('paymentOptions.chosenCard', (newCard, oldCard) => {
        if (newCard === oldCard) {
            return;
        }

        if (!newCard) {
            $scope.isAmericanExpressVisible = true;
            $scope.isMaestroVisible = true;
            $scope.isMastercardVisible = true;
            $scope.isVisaVisible = true;
        } else {
            $scope.isAmericanExpressVisible = false;
            $scope.isMaestroVisible = false;
            $scope.isMastercardVisible = false;
            $scope.isVisaVisible = false;

            switch (newCard.type) {
                case 'American Express':
                    $scope.isAmericanExpressVisible = true;
                    break;
                case 'Maestro':
                    $scope.isMaestroVisible = true;
                    break;
                case 'MasterCard':
                    $scope.isMastercardVisible = true;
                    break;
                case 'Visa':
                    $scope.isVisaVisible = true;
                    break;
            }
        }
    });

    const saveNewCardAndConfirm = () => {
        const newCard = angular.copy($scope.paymentOptions.newCard);
        if (!newCard.number || !newCard.expirationMonth || !newCard.expirationYear || !newCard.cvc) {
            $scope.cardInformationRequiredError = true;
            NotificationService.notifyError('Please enter the details of the card you want to pay with.');
            return;
        }

        LoadingService.show();

        UsersFactory.addPaymentCard(newCard)
            .success(response => {
                if (!response.ok) {
                    NotificationService.notifyError(response.errorTranslation);
                    return;
                }

                $scope.cards.push(response.card);
                $scope.paymentOptions.chosenCard = response.card;
                $scope.cardInformationRequiredError = false;
                $scope.confirm();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };

    $scope.confirm = () => {
        if ($scope.paymentOptions.isToBePaidOnAccount && !$scope.paymentOptions.canPayOnAccount) {
            NotificationService.notifyError('You cannot pay on account.');
            return;
        }

        if (!$scope.paymentOptions.isToBePaidOnAccount && !$scope.paymentOptions.chosenCard) {
            saveNewCardAndConfirm();
            return;
        }

        const requestAttributes = {
            purchaseOrderNumber: $scope.paymentOptions.purchaseOrderNumber,
            departmentReference: $scope.paymentOptions.departmentReference
        };

        if (!$scope.paymentOptions.isToBePaidOnAccount) {
            requestAttributes.payOnCard = $scope.paymentOptions.chosenCard.id;
        }

        if ($scope.paymentOptions.isToBePaidOnAccount) {
            requestAttributes.paymentTerm = 1;
        } else {
            // If the meal plan requirements had the payment term as pay on account, but the
            // customer has chosen to pay by card, default to them paying at the time of delivery.
            // If the meal plan requirements had a payment term for paying for card, use that.
            const requirementsPaymentTerm = $scope.mealPlan.requirementsAtGeneration.paymentTerm;
            if (requirementsPaymentTerm === 1) {
                requestAttributes.paymentTerm = 3;
            } else {
                requestAttributes.paymentTerm = requirementsPaymentTerm;
            }
        }

        LoadingService.show();

        MealPlanFactory.confirmProposedOrders($scope.customer.id, mealPlanId, requestAttributes)
            .success(response => $location.path(`/customer/meal-plans/${mealPlanId}/success`))
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

    };
});
