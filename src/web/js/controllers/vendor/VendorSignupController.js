angular.module('cp.controllers.vendor').controller('VendorSignupController',
        function($scope, $cookies, $location, $window, DocumentTitleService, LoadingService,
        SecurityService, UsersFactory, VendorsFactory) {
    DocumentTitleService('Vendor signup');

    if (SecurityService.inGroup(['admin', 'user'])) {
        $window.location = '/';
    }

    $scope.address = {countryName: 'United Kingdom'};
    $scope.businessTypeOptions = [];

    function getBusinessTypeOptions() {
        VendorsFactory.getBusinessTypes().success(response => {
            $scope.businessTypeOptions = response.businessTypes;
            LoadingService.hide();
        });
    }

    getBusinessTypeOptions();

    $scope.submit = function() {
        if (!$scope.vendorSignupForm.$valid) {
            return;
        }

        LoadingService.show();

        $scope.vendorSignupFormError = null;

        const signupDetails = {
            businessName: $scope.vendor.name,
            businessTypeId: $scope.vendor.type,
            address: {
                addressLine1: $scope.address.addressLine1,
                addressLine2: $scope.address.addressLine2 ? $scope.address.addressLine2 : null,
                addressLine3: $scope.address.addressLine3 ? $scope.address.addressLine3 : null,
                city: $scope.address.city,
                county: $scope.address.county ? $scope.address.county : null,
                postcode: $scope.address.postcode,
                countryName: $scope.address.countryName,
                landlineNumber: $scope.address.landlineNumber,
                orderNotificationMobileNumbers: [$scope.address.mobileNumber],
                contactName: $scope.name
            },
            name: $scope.name,
            email: $scope.email,
            plainPassword: $scope.plainPassword
        };

        UsersFactory.registerVendor(signupDetails)
            .success(response => {
                $cookies.userId = response.apiAuth.userId;
                $cookies.salt = response.apiAuth.salt;
                $cookies.vendorId = response.vendor.id;
                $window.localStorage.setItem('user', JSON.stringify(response.user));
                $location.path('/vendor/signup/package');
            })
            .catch(response => {
                $scope.vendorSignupFormError = response.data.errorTranslation;
                LoadingService.hide();
            });
    };
});
