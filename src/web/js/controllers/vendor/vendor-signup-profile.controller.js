angular.module('cp.controllers.general').controller('VendorSignUpProfileController',
        function($scope, $window, $cookies, DocumentTitleService, LoadingService, VendorsFactory, PackagesFactory) {
    DocumentTitleService('Vendor sign up');
    LoadingService.hide();

    $scope.vendorMaxPeople = 1;
    $scope.vendorMaxPeopleOptions = PackagesFactory.getQuantityOptions();

    $scope.saveProfile = function(vendorProfileForm) {
        if (!vendorProfileForm.$valid) {
            return;
        }

        LoadingService.show();

        $scope.saveProfileError = null;

        // @todo – http:// prefix directive for URLs.
        const vendorDetails = {
            description: $scope.vendorDescription,
            maxPeople: $scope.vendorMaxPeople,
            isVatRegistered: $scope.vendorVatRegistered,
            vatNumber: $scope.vendorVatNumber ? $scope.vendorVatNumber : null,
            facebookUrl: $scope.vendorFacebookUrl ? $scope.vendorFacebookUrl : null,
            twitterUrl: $scope.vendorTwitterUrl ? $scope.vendorTwitterUrl : null,
            googlePlusUrl: $scope.vendorGooglePlusUrl ? $scope.vendorGooglePlusUrl : null,
            youtubeUrl: $scope.vendorYoutubeUrl ? $scope.vendorYoutubeUrl : null,
            url: $scope.vendorUrl ? $scope.vendorUrl : null
        };

        VendorsFactory.updateVendor($cookies.vendorId, vendorDetails)
            .success(response => {
                $window.location = '/vendor/signup/agreement';
            })
            .catch(response => {
                $scope.saveProfileError = response.data.errorTranslation;
                LoadingService.hide();
            });
    };
});
