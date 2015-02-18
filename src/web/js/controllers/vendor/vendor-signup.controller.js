angular.module('cp.controllers.general').controller('VendorSignUpController',
        function($scope, $cookies, $window, DocumentTitleService, LoadingService, SecurityService, UsersFactory, VendorsFactory) {
    DocumentTitleService('Vendor sign up');

    if (SecurityService.inGroup(['admin', 'user'])) {
        $window.location = '/';
    }

    $scope.countryName = 'United Kingdom';
    $scope.businessTypeOptions = [];

    function getBusinessTypeOptions() {
        VendorsFactory.getBusinessTypes().success(response => {
            $scope.businessTypeOptions = response.businessTypes;
            LoadingService.hide();
        });
    }

    getBusinessTypeOptions();

    $scope.signUp = function(vendorSignUpForm) {
        if (!vendorSignUpForm.$valid) {
            return;
        }

        LoadingService.show();

        $scope.signUpError = null;

        const signUpDetails = {
            businessName: $scope.businessName,
            businessTypeId: $scope.businessType,
            address: {
                addressLine1: $scope.addressLine1,
                addressLine2: $scope.addressLine2 ? $scope.addressLine2 : null,
                addressLine3: $scope.addressLine3 ? $scope.addressLine3 : null,
                city: $scope.city,
                county: $scope.county ? $scope.county : null,
                postcode: $scope.postcode,
                countryName: $scope.countryName,
                landlineNumber: $scope.landlineNumber,
                orderNotificationMobileNumber: $scope.mobileNumber,
                deliveryContactMobileNumber: $scope.mobileNumber,
                contactName: $scope.name
            },
            name: $scope.name,
            email: $scope.email,
            plainPassword: $scope.plainPassword
        };

        UsersFactory.registerVendor(signUpDetails)
            .success(response => {
                $cookies.userId = response.apiAuth.userId;
                $cookies.salt = response.apiAuth.salt;
                $cookies.vendorId = response.vendor.id;
                $window.localStorage.setItem('user', JSON.stringify(response.user));
                $window.location = '/vendor/signup/package';
            })
            .catch(response => {
                $scope.signUpError = response.data.errorTranslation;
                LoadingService.hide();
            });
    };
});
