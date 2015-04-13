angular.module('cp.controllers.general').controller('CheckoutPaymentController',
        function($scope, DocumentTitleService, SecurityService, LoadingService, PackagesFactory,
        CheckoutService, $location, UsersFactory, $q, NotificationService, OrdersFactory,
        getCardNumberMaskFilter) {
    DocumentTitleService('Checkout: Payment');
    SecurityService.requireLoggedIn();

    $scope.order = {totalAmount: CheckoutService.getTotalAmount()};

    $scope.cards = [];
    $scope.card = {};
    $scope.isAmericanExpressVisible = true;
    $scope.isCardExpiryDateVisible = false;
    $scope.isMaestroVisible = true;
    $scope.isMastercardVisible = true;
    $scope.isVisaVisible = true;
    $scope.package = {};

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
        const promise1 = PackagesFactory.getPackage(CheckoutService.getPackageId())
            .success(response => {
                $scope.package = response;
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        const promise2 = UsersFactory.getPaymentCards()
            .success(response => {
                $scope.cards = response.cards;
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        $q.all([promise1, promise2]).then(() => {
            $scope.cards.forEach(card => {
                card.numberMasked = getCardNumberMaskFilter(card.last4, card.type);
            });

            if ($scope.cards.length > 0) {
                $scope.order.paymentMethod = $scope.cards[0];
            }

            LoadingService.hide();
        });
    }

    init();

    $scope.$watch('order.paymentMethod', (paymentMethod, oldPaymentMethod) => {
        if (paymentMethod === oldPaymentMethod) {
            return;
        }

        if (typeof paymentMethod === 'undefined') {
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

    $scope.finish = function() {
        // @todo - check form is valid.

        LoadingService.show();

        let orderDetails = {
            customDietaryRequirements: CheckoutService.getDietaryRequirementsExtra(),
            deliveryAddress: CheckoutService.getDeliveryAddressId(),
            // @todo - departmentReference
            headCount: CheckoutService.getHeadCount(),
            // @todo - isPaidOnAccount
            package: CheckoutService.getPackageId(),
            packagingTypeChoice: CheckoutService.getPackagingType(),
            // @todo - promotion
            // @todo - purchaseOrderNumber
            requestedDeliveryDate: CheckoutService.getDeliveryDate().toISOString(),
            vegetarianHeadCount: CheckoutService.getVegetarianHeadCount(),
            // @todo - voucherAmount
            // @todo - voucherName
            willVendorDeliverCutleryAndServiettes: CheckoutService.isCutleryAndServiettesRequired(),
            willVendorSetUpAfterDelivery: CheckoutService.isVendorRequiredToSetUp(),
            willVendorCleanUpAfterDelivery: CheckoutService.isVendorRequiredToCleanUp()
        };

        let promises = [];

        if (typeof $scope.order.paymentMethod === 'undefined') {
            const promise1 = UsersFactory.addPaymentCard($scope.card)
                .success(response => {
                    orderDetails.debitCard = response.card.id;
                })
                .catch(response => NotificationService.notifyError(response.data.errorTranslation));
            promises.push(promise1);
        } else {
            orderDetails.debitCard = $scope.order.paymentMethod.id;
        }

        const promise2 = OrdersFactory.createOrder(orderDetails)
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
        promises.push(promise2);

        $q.all(promises).then(() => {
            CheckoutService.setEndTime(new Date());
            CheckoutService.reset();
            $location.path('/checkout/thank-you');
        });
    };
});
