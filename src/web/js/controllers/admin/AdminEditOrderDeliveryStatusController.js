angular.module('cp.controllers.admin').controller('AdminEditOrderDeliveryStatusController',
        function($scope, $routeParams, $location, OrdersFactory, NotificationService,
        DocumentTitleService, SecurityService, LoadingService) {
    DocumentTitleService('Edit order delivery status');
    SecurityService.requireStaff();

    $scope.options = OrdersFactory.getDeliveryStatusOptions();
    $scope.update = {
        deliveryStatus: null,
        reasonForNotUsingTheSmsSystem: '',
        reasonForNotUsingTheMobileApp: '',
        reasonForNotUsingTheMobileWebsite: '',
        minutesSpent: 0
    };
    $scope.order = {};

    OrdersFactory.getOrder($routeParams.orderId)
        .success(function(order) {
            $scope.order = order;
            LoadingService.hide();
        })
        .error(response => NotificationService.notifyError(response.data.errorTranslation));

    $scope.save = function() {
        if (!$scope.updateForm.$valid) {
            NotificationService.notifyError('All form fields are required.');
            return;
        }

        LoadingService.show();

        const reasonForManualUpdate = `Reason the vendor didn't use the SMS system: ${$scope.update.reasonForNotUsingTheSmsSystem}\n` +
            `Reason the vendor didn't use the mobile app: ${$scope.update.reasonForNotUsingTheMobileApp}\n` +
            `Reason the vendor didn't use the mobile website: ${$scope.update.reasonForNotUsingTheMobileWebsite}\n` +
            `Minutes spent chasing the delivery status: ${$scope.update.minutesSpent}`;

        const updateRequestData = {
            deliveryStatus: $scope.update.deliveryStatus,
            reasonForManualUpdate: reasonForManualUpdate,
            sendEmails: true
        };

        OrdersFactory.setDeliveryStatus($routeParams.orderId, updateRequestData)
            .success(response => {
                $scope.order = response.order;
                NotificationService.notifySuccess('The delivery status has been updated.');
                $location.path(`/admin/order/${$routeParams.orderId}`);
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
