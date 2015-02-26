angular.module('cp').directive('cpVendorProfileForm', function($cookies, $location, LoadingService,
        PackagesFactory, VendorsFactory, NotificationService) {
    return {
        restrict: 'E',
        scope: {
            destination: '@cpDestination',
            submitValue: '@cpSubmitValue',
            vendor: '=cpVendor'
        },
        controller: function($scope) {
            $scope.vendorMaxPeopleOptions = PackagesFactory.getQuantityOptions();

            $scope.$watch('vendor.isVatRegistered', () =>
                $scope.vendor.isVatRegisteredString = ($scope.vendor.isVatRegistered ? 'true' : 'false')
            );

            $scope.submit = function() {
                if (!$scope.vendorProfileForm.$valid) {
                    return;
                }

                LoadingService.show();

                $scope.vendorProfileFormError = null;

                const vendorDetails = {
                    description: $scope.vendor.description,
                    maxPeople: $scope.vendor.maxPeople,
                    isVatRegistered: $scope.vendor.isVatRegisteredString === 'true',
                    vatNumber: $scope.vendor.vatNumber ? $scope.vendor.vatNumber : null,
                    facebookUrl: $scope.vendor.facebookUrl ? $scope.vendor.facebookUrl : null,
                    twitterUrl: $scope.vendor.twitterUrl ? $scope.vendor.twitterUrl : null,
                    googlePlusUrl: $scope.vendor.googlePlusUrl ? $scope.vendor.googlePlusUrl : null,
                    youtubeUrl: $scope.vendor.youtubeUrl ? $scope.vendor.youtubeUrl : null,
                    url: $scope.vendor.url ? $scope.vendor.url : null
                };

                VendorsFactory.updateSelf(vendorDetails)
                    .success(response => {
                        $location.path($scope.destination);
                        // If the location in $scope.destination is the current location,
                        // the controller will not refresh, so call LoadingService.hide() here for
                        // that case only.
                        LoadingService.hide();
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
