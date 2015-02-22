angular.module('cp').directive('cpVendorProfileForm', function($cookies, $window, LoadingService,
        PackagesFactory, VendorsFactory) {
    return {
        restrict: 'E',
        scope: {
            destination: '@cpDestination',
            submitValue: '@cpSubmitValue',
            vendor: '=cpVendor'
        },
        controller: function($scope) {
            $scope.vendorMaxPeopleOptions = PackagesFactory.getQuantityOptions();

            $scope.submit = function() {
                if (!$scope.vendorProfileForm.$valid) {
                    return;
                }

                LoadingService.show();

                $scope.vendorProfileFormError = null;

                // @todo – http:// prefix directive for URLs (23/02).
                const vendorDetails = {
                    description: $scope.vendor.description,
                    maxPeople: $scope.vendor.maxPeople,
                    isVatRegistered: $scope.vendor.vatRegistered,
                    vatNumber: $scope.vendor.vatNumber ? $scope.vendor.vatNumber : null,
                    facebookUrl: $scope.vendor.facebookUrl ? $scope.vendor.facebookUrl : null,
                    twitterUrl: $scope.vendor.twitterUrl ? $scope.vendor.twitterUrl : null,
                    googlePlusUrl: $scope.vendor.googlePlusUrl ? $scope.vendor.googlePlusUrl : null,
                    youtubeUrl: $scope.vendor.youtubeUrl ? $scope.vendor.youtubeUrl : null,
                    url: $scope.vendor.url ? $scope.vendor.url : null
                };

                VendorsFactory.updateVendor($cookies.vendorId, vendorDetails)
                    .success(response => {
                        $window.location = $scope.destination;
                    })
                    .catch(response => {
                        $scope.vendorProfileFormError = response.data.errorTranslation;
                        LoadingService.hide();
                    });
            };
        },
        templateUrl: '/dist/templates/vendor/vendor-profile.html'
    };
});
