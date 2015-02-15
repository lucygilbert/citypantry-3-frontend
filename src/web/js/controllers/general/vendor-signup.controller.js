angular.module('cp.controllers.general').controller('VendorSignUpController',
        function($scope, $cookies, $window, DocumentTitleService, LoadingService, SecurityService, UsersFactory, VendorsFactory) {
    DocumentTitleService('Vendor sign up');

    if (SecurityService.inGroup(['admin', 'user'])) {
        $window.location = '/';
    }

    $scope.businessCountryName = 'United Kingdom';
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
                label: $scope.businessAddressLine1,
                addressLine1: $scope.businessAddressLine1,
                addressLine2: $scope.businessAddressLine2,
                addressLine3: $scope.businessAddressLine3,
                city: $scope.businessCity,
                county: $scope.businessCounty,
                postcode: $scope.businessPostcode,
                countryName: $scope.businessCountryName,
                landlineNumber: $scope.businessLandlineNumber,
                orderNotificationMobileNumber: $scope.businessMobileNumber,
                deliveryContactMobileNumber: $scope.businessMobileNumber,
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
                $window.localStorage.setItem('user', JSON.stringify(response.user));
                $window.location = '/vendor/signup/package';
            })
            .catch(response => {
                $scope.signUpError = response.data.errorTranslation;
                LoadingService.hide();
            });
    };
});
