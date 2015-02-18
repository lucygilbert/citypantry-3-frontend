angular.module('cp.controllers.general').controller('VendorSignUpPackageController',
        function($scope, $cookies, $location, $anchorScroll, $window, $q, DocumentTitleService, LoadingService,
                 SecurityService, AddressFactory, PackagesFactory, VendorsFactory, uiGmapGoogleMapApi) {

    DocumentTitleService('Vendor sign up');
    LoadingService.hide();

    $scope.address = {countryName: 'United Kingdom'};
    $scope.allergenTypeOptions = [];
    $scope.cuisineTypeOptions = [];
    $scope.deliveryDayOptions = PackagesFactory.getDeliveryDayOptions();
    $scope.deliveryTimeOptions = PackagesFactory.getDeliveryTimeOptions();
    $scope.deliveryZones = [];
    $scope.dietaryTypeOptions = [];
    $scope.eventTypeOptions = [];
    $scope.isAddAddressFormHidden = true;
    $scope.map = {};
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
    $scope.radiusOptions = PackagesFactory.getRadiusOptions();
    $scope.vendorAddresses = [];

    function init() {
        let promise1 = PackagesFactory.getAllergenTypes().success(response => {
            $scope.allergenTypeOptions = response.allergenTypes;
        });
        let promise2 = PackagesFactory.getDietaryTypes().success(response => {
            var dietaryTypes = response.dietaryRequirements;

            dietaryTypes.forEach(dietaryType => {
                $scope.dietaryTypeOptions.push({
                    name: dietaryType.name
                });
            });
        });
        let promise3 = PackagesFactory.getEventTypes().success(response => {
            $scope.eventTypeOptions = response.eventTypes;
        });
        let promise4 = PackagesFactory.getCuisineTypes().success(response => {
            $scope.cuisineTypeOptions = response.cuisineTypes;
        });
        let promise5 = VendorsFactory.getAddresses().success(response => {
            $scope.vendorAddresses = response.addresses;
            $scope.vendorAddresses.forEach(function(address) {
                address.deliveryRadius = 2; // Default delivery radius.
                address.isSelected = true;
            });
            $scope.createDeliveryZones();
        });

        $q.all([promise1, promise2, promise3, promise4, promise5]).then(() => LoadingService.hide());
    }

    init();

    uiGmapGoogleMapApi.then(function(maps) {
        // @todo – store latitude and longitude as constants?
        $scope.map = {
            center: {
                latitude: 51.527787,
                longitude: -0.127691
            },
            options: {
                scrollwheel: false
            },
            zoom: 12
        };
    });

    $scope.addAddress = function() {
        if (!$scope.addAddressForm.$valid) {
            return;
        }

        LoadingService.show();

        const addressDetails = {
            addressLine1: $scope.address.addressLine1,
            addressLine2: $scope.address.addressLine2 ? $scope.address.addressLine2 : null,
            addressLine3: $scope.address.addressLine3 ? $scope.address.addressLine3 : null,
            city: $scope.address.city,
            county: $scope.address.county ? $scope.address.county : null,
            postcode: $scope.address.postcode,
            countryName: $scope.address.countryName,
            landlineNumber: $scope.address.landlineNumber,
            orderNotificationMobileNumber: $scope.address.orderNotificationMobileNumber,
            deliveryContactMobileNumber: $scope.address.deliveryContactMobileNumber,
            contactName: $scope.address.contactName
        };

        AddressFactory.createAddress(addressDetails)
            .success(response => {
                $scope.isAddAddressFormHidden = true;
                $scope.address = {countryName: 'United Kingdom'}; // Reset address form fields.
                $location.hash('addresses');
                $anchorScroll();
            })
            .catch(response => {
                $scope.addAddressError = response.data.errorTranslation;
            });

        VendorsFactory.getAddresses().success(response => {
            $scope.vendorAddresses = response.addresses;
            $scope.createDeliveryZones();
            LoadingService.hide();
        });
    };

    $scope.addAnotherAddress = function() {
        $scope.isAddAddressFormHidden = false;
    };

    $scope.addPackageItem = function() {
        $scope.packageItems.push({});
    };

    $scope.createDeliveryZones = function() {
        $scope.deliveryZones = [];

        $scope.vendorAddresses.forEach(function(address, index) {
            $scope.deliveryZones.push({
                id: index,
                center: {
                    latitude: address.latitude,
                    longitude: address.longitude
                },
                fill: {
                    color: '#ff0000',
                    opacity: .3
                },
                radius: address.deliveryRadius * 1609.344, // Metres.
                stroke: {
                    weight: 0
                }
            });
        });

        $scope.map.refresh = true;
    };

    $scope.createPackage = function() {
        if (!$scope.createPackageForm.$valid) {
            return;
        }

        LoadingService.show();

        $scope.createPackageError = null;

        var deliveryRadiuses = new Map();

        $scope.vendorAddresses.forEach(function(address) {
            if (address.isSelected) {
                deliveryRadiuses.set(address._id, address.deliveryRadius);
            }
        });

        const packageDetails = {
            cuisineType: $scope.packageCuisineType,
            name: $scope.packageName,
            shortDescription: $scope.packageShortDescription ? $scope.packageShortDescription : null,
            description: $scope.packageDescription,
            items: ($scope.packageItems.length > 0) ? $scope.packageItems : null,
            dietaryRequirements: ($scope.packageDietaryTypes.length > 0) ? $scope.packageDietaryTypes : null,
            allergenTypes: ($scope.packageAllergenTypes.length > 0) ? $scope.packageAllergenTypes : null,
            eventTypes: ($scope.packageEventTypes.length > 0) ? $scope.packageEventTypes : null,
            hotFood: $scope.packageHotFood,
            costIncludingVat: $scope.packageCost,
            // @todo – confirm a map is the correct format.
            deliveryRadiuses: deliveryRadiuses,
            minPeople: $scope.packageMinPeople,
            maxPeople: $scope.packageMaxPeople,
            notice: $scope.packageNotice,
            deliveryDays: $scope.packageDeliveryDays,
            deliveryTimeStart: $scope.packageDeliveryTimeStart,
            deliveryTimeEnd: $scope.packageDeliveryTimeEnd,
            deliveryCostIncludingVat: $scope.packageDeliveryCost,
            freeDeliveryThreshold: $scope.packageFreeDeliveryThreshold,
            vendor: $cookies.vendorId
        };

        PackagesFactory.createPackage(packageDetails)
            .success(response => {
                $window.location = '/vendor/signup/profile';
            })
            .catch(response => {
                $scope.createPackageError = response.data.errorTranslation;
                LoadingService.hide();
            });
    };
});
