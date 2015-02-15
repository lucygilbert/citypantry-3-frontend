angular.module('cp.controllers.general').controller('VendorSignUpPackageController',
        function($scope, $window, DocumentTitleService, LoadingService, SecurityService, VendorsFactory, PackagesFactory) {
    DocumentTitleService('Vendor sign up');
    LoadingService.hide();

    $scope.allergenTypeOptions = [];
    $scope.businessAddresses = VendorsFactory.getBusinessAddresses();
    $scope.deliveryDayOptions = PackagesFactory.getDeliveryDayOptions();
    $scope.deliveryTimeOptions = PackagesFactory.getDeliveryTimeOptions();
    $scope.dietaryTypeOptions = [];
    $scope.eventTypeOptions = [];
    $scope.foodTypeOptions = [];
    $scope.newBusinessAddresses = [];
    $scope.noticeOptions = PackagesFactory.getNoticeOptions();
    $scope.packageAllergenTypes = [];
    $scope.packageDeliveryDays = [];
    $scope.packageDeliveryTimeEnd = 0;
    $scope.packageDeliveryTimeStart = 0;
    $scope.packageDietaryTypes = [];
    $scope.packageEventTypes = [];
    $scope.packageItems = [{}, {}, {}, {}];
    $scope.packageMaxPeople = 1;
    $scope.packageMinPeople = 1;
    $scope.quantityOptions = PackagesFactory.getQuantityOptions();

    init();

    function init() {
        PackagesFactory.getAllergenTypes().success(response => {
            $scope.allergenTypeOptions = response.allergenTypes;
        });
        PackagesFactory.getDietaryTypes().success(response => {
            $scope.dietaryTypeOptions = response.dietaryRequirements;
        });
        PackagesFactory.getEventTypes().success(response => {
            $scope.eventTypeOptions = response.eventTypes;
        });
        PackagesFactory.getFoodTypes().success(response => {
            $scope.foodTypeOptions = response.cuisineTypes;
        });
        LoadingService.hide();
    }

    $scope.addNewBusinessAddress = function() {
        $scope.newBusinessAddresses.push({
            businessAddressLine1: null,
            businessAddressLine2: null,
            businessAddressLine3: null,
            businessCity: null,
            businessCounty: null,
            businessPostcode: null,
            businessCountryName: 'United Kingdom',
            businessLandlineNumber: null,
            businessOrderNotificationMobileNumber: null,
            businessDeliveryContactMobileNumber: null,
            businessContactName: null
        });
    };

    $scope.addPackageItem = function() {
        $scope.packageItems.push({});
    };

    $scope.createPackage = function(createPackageForm) {
        if (createPackageForm.$valid) {
            LoadingService.show();

            $scope.createPackageError = null;

            // @todo – add $scope.packageItems
            // @todo – add vendor ID.
            const packageDetails = {
                cuisineType: $scope.packageFoodType,
                name: $scope.packageName,
                shortDescription: $scope.packageShortDescription,
                description: $scope.packageDescription,
                // @todo – dietary requirements should return array of objects.
                dietaryRequirements: $scope.packageDietaryTypes,
                allergenTypes: $scope.packageAllergenTypes,
                eventTypes: $scope.packageEventTypes,
                hotFood: $scope.packageHotFood,
                costIncludingVat: $scope.packageCost,
                minPeople: $scope.packageMinPeople,
                maxPeople: $scope.packageMaxPeople,
                notice: $scope.packageNotice,
                deliveryDays: $scope.packageDeliveryDays,
                deliveryTimeStart: $scope.packageDeliveryTimeStart,
                deliveryTimeEnd: $scope.packageDeliveryTimeEnd,
                deliveryCostIncludingVat: $scope.packageDeliveryCost,
                freeDeliveryThreshold: $scope.packageFreeDeliveryThreshold
            };

            PackagesFactory.createPackage(packageDetails)
                .success(response => {
                    $window.location = '/vendor/signup/profile';
                })
                .catch(response => {
                    $scope.createPackageError = response.data.errorTranslation;
                    LoadingService.hide();
                });

            // @todo – add new business addresses.
            if ($scope.newBusinessAddresses.length > 0) {}
        }
    };
});
