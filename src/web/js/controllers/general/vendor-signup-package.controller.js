angular.module('cp.controllers.general').controller('VendorSignUpPackageController',
        function($scope, $cookies, $window, $q, DocumentTitleService, LoadingService, SecurityService, LocationsFactory, PackagesFactory, uiGmapGoogleMapApi) {
    DocumentTitleService('Vendor sign up');
    LoadingService.hide();

    $scope.address = { countryName: 'United Kingdom' };
    $scope.allergenTypeOptions = [];
    $scope.deliveryDayOptions = PackagesFactory.getDeliveryDayOptions();
    $scope.deliveryTimeOptions = PackagesFactory.getDeliveryTimeOptions();
    $scope.deliveryZones = [];
    $scope.dietaryTypeOptions = [];
    $scope.eventTypeOptions = [];
    $scope.foodTypeOptions = [];
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
            $scope.dietaryTypeOptions = response.dietaryRequirements;
        });
        let promise3 = PackagesFactory.getEventTypes().success(response => {
            $scope.eventTypeOptions = response.eventTypes;
        });
        let promise4 = PackagesFactory.getFoodTypes().success(response => {
            $scope.foodTypeOptions = response.cuisineTypes;
        });
        let promise5 = LocationsFactory.getAddresses().success(response => {
            $scope.vendorAddresses = response;
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

        $scope.createDeliveryZones();
    });

    $scope.addAddress = function() {
        if (!$scope.addAddressForm.$valid) {
            return;
        }

        LoadingService.show();

        const addressDetails = {
            label: $scope.address.addressLine1,
            addressLine1: $scope.address.addressLine1,
            addressLine2: $scope.address.addressLine2,
            addressLine3: $scope.address.addressLine3,
            city: $scope.address.city,
            county: $scope.address.county,
            postcode: $scope.address.postcode,
            countryName: $scope.address.countryName,
            landlineNumber: $scope.address.landlineNumber,
            orderNotificationMobileNumber: $scope.address.orderNotificationMobileNumber,
            deliveryContactMobileNumber: $scope.address.deliveryContactMobileNumber,
            contactName: $scope.address.contactName
        };

        LocationsFactory.createAddress(addressDetails)
            .success(response => {
                $scope.isAddAddressFormHidden = true;
                $scope.address = { countryName: 'United Kingdom' }; // Reset address form fields.
            })
            .catch(response => {
                $scope.addAddressError = response.data.errorTranslation;
                LoadingService.hide();
            });

        LocationsFactory.getAddresses().success(response => {
            $scope.vendorAddresses = response;
            $scope.createDeliveryZones();
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
            deliveryRadiuses.set(address._id, address.deliveryRadius);
        });

        // @todo – add $scope.packageItems
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
