// @todo - find out what this controller does. It doesn't seem to be related to a design.

angular.module('cp.controllers.admin').controller('AdminMealPlanPaymentController',
        function($scope, $q, $routeParams, DocumentTitleService, LoadingService, SecurityService, NotificationService,
        CustomersFactory, UsersFactory, getCardNumberMaskFilter) {
    DocumentTitleService('Meal plan payment');
    SecurityService.requireStaff();

    $scope.cards = [];
    $scope.card = {};
    $scope.customer = {};
    $scope.isAmericanExpressVisible = true;
    $scope.isCardExpiryDateVisible = false;
    $scope.isMaestroVisible = true;
    $scope.isMastercardVisible = true;
    $scope.isVisaVisible = true;
    $scope.mealPlan = {}; // It should include meal plan orders.

    const thisYear = (new Date()).getFullYear();
    $scope.yearOptions = [];
    for (let year = thisYear; year < thisYear + 10; year += 1) {
        $scope.yearOptions.push({label: year, value: year});
    }

    $scope.monthOptions = [];
    for (let month = 1; month <= 12; month += 1) {
        $scope.monthOptions.push({label: ('0' + month).slice(-2), value: ('0' + month).slice(-2)});
    }

    function init() {
        const promise1 = CustomersFactory.getCustomer($routeParams.customerId)
            .success(customer => {
                $scope.customer = customer;
            })
            .error(response => NotificationService.notifyError(response.data.errorTranslation));

        const promise2 = UsersFactory.getPaymentCards()
            .success(response => {
                $scope.cards = response.cards;
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        // @todo - getMealPlan()

        $q.all([promise1, promise2]).then(() => {
            $scope.cards.forEach(card => card.numberMasked = getCardNumberMaskFilter(card.last4, card.type));

            if ($scope.cards.length > 0) {
                $scope.mealPlan.paymentMethod = $scope.cards[0];
            }

            if ($scope.customer.isPaidOnAccount) {
                $scope.mealPlan.isPayOnAccount = true;
            }

            LoadingService.hide();
        });
    }

    init();

    $scope.$watch('mealPlan.paymentMethod', (paymentMethod, oldPaymentMethod) => {
        if (paymentMethod === oldPaymentMethod) {
            return;
        }

        if (!paymentMethod) {
            $scope.isAmericanExpressVisible = true;
            $scope.isMaestroVisible = true;
            $scope.isMastercardVisible = true;
            $scope.isVisaVisible = true;
            $scope.isCardExpiryDateVisible = false;
        } else {
            $scope.isAmericanExpressVisible = false;
            $scope.isMaestroVisible = false;
            $scope.isMastercardVisible = false;
            $scope.isVisaVisible = false;
            $scope.isCardExpiryDateVisible = true;

            switch (paymentMethod.type) {
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

    $scope.pay = () => {
        if ($scope.mealPlanPaymentForm.$invalid) {
            $scope.mealPlanPaymentForm.$submitted = true;
            return;
        }

        LoadingService.show();
    };
});
