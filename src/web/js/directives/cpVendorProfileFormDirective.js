angular.module('cp').directive('cpVendorProfileForm', function($cookies, $location, LoadingService,
        PackagesFactory, VendorsFactory, NotificationService, $upload, API_BASE, ApiService,
        getTemplateUrl) {
    return {
        restrict: 'E',
        scope: {
            destination: '@cpDestination',
            submitValue: '@cpSubmitValue',
            vendor: '=cpVendor',
            showSuccessModal: '=cpShowSuccessModal'
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
                    url: $scope.vendor.url ? $scope.vendor.url : null,
                    images: $scope.vendor.images ? $scope.vendor.images : []
                };

                VendorsFactory.updateSelf(vendorDetails)
                    .success(response => {
                        $location.path($scope.destination);
                        // If the location in $scope.destination is the current location,
                        // the controller will not refresh, so call LoadingService.hide() here for
                        // that case only.
                        LoadingService.hide();

                        if ($scope.showSuccessModal) {
                            NotificationService.notifySuccess('Your profile has been updated.');
                        }
                    })
                    .catch(response => {
                        $scope.vendorProfileFormError = response.data.errorTranslation;
                        LoadingService.hide();
                    });
            };

            $scope.upload = function (files, event) {
                // If we don't call 'preventDefault()', the button acts as a submit for the form.
                event.preventDefault();

                if (!files || !files.length) {
                    return;
                }

                LoadingService.show();

                for (let i = 0; i < files.length; i++) {
                    const file = files[i];

                    $upload.upload({
                        url: API_BASE + '/vendors/upload-image' + ($scope.vendor.id ? '?id=' + $scope.vendor.id : ''),
                        file: file,
                        headers: ApiService.getAuthHeaders()
                    }).success(response => {
                        if ($scope.vendor.images === undefined) {
                            $scope.vendor.images = [];
                        }

                        $scope.vendor.images.push({
                            original: response.paths.originalUrl,
                            large: response.paths.largeUrl,
                            medium: response.paths.mediumUrl,
                            thumbnail: response.paths.thumbnailUrl
                        });

                        LoadingService.hide();
                    });
                }
            };
        },
        templateUrl: getTemplateUrl('vendor/vendor-profile.html')
    };
});
