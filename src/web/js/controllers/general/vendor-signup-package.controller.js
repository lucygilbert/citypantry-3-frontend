angular.module('cp.controllers.general').controller('VendorSignUpPackageController',
        function($scope, $window, $q, DocumentTitleService, LoadingService, SecurityService, VendorsFactory, PackagesFactory, uiGmapGoogleMapApi) {
    DocumentTitleService('Vendor sign up');
    LoadingService.hide();

    $scope.allergenTypeOptions = [];
    $scope.businessAddresses = VendorsFactory.getBusinessAddresses();
    $scope.businessCountryName = 'United Kingdom';
    $scope.deliveryDayOptions = PackagesFactory.getDeliveryDayOptions();
    $scope.deliveryTimeOptions = PackagesFactory.getDeliveryTimeOptions();
    $scope.deliveryZones = [];
    $scope.dietaryTypeOptions = [];
    $scope.eventTypeOptions = [];
    $scope.foodTypeOptions = [];
    $scope.isAddBusinessAddressFormHidden = true;
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

        $q.all([promise1, promise2, promise3, promise4]).then(() => LoadingService.hide());
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

    $scope.addBusinessAddress = function() {
        // LoadingService.show();

        const addressDetails = {
            label: $scope.businessAddressLine1,
            addressLine1: $scope.businessAddressLine1,
            addressLine2: $scope.businessAddressLine2,
            addressLine3: $scope.businessAddressLine3,
            city: $scope.businessCity,
            county: $scope.businessCounty,
            postcode: $scope.businessPostcode,
            countryName: $scope.businessCountryName,
            landlineNumber: $scope.businessLandlineNumber,
            orderNotificationMobileNumber: $scope.businessOrderNotificationMobileNumber,
            deliveryContactMobileNumber: $scope.businessDeliveryContactMobileNumber,
            contactName: $scope.businessContactName
            // @todo – delete _id, deliveryRadius, latitude and longitude.
            ,_id: 1,
            deliveryRadius: 2,
            latitude: '51.522737',
            longitude: '-0.085485'
        };

        // @todo – post address details.
        // VendorsFactory.(addressDetails)
        //     .success(response => {
        //
        //     })
        //     .catch(response => {
        //         $scope.addBusinessAddressError = response.data.errorTranslation;
        //         LoadingService.hide();
        //     });

        $scope.isAddBusinessAddressFormHidden = true;

        // @todo – re-fetch business addresses.
        // $scope.businessAddresses = VendorsFactory.getBusinessAddresses();
        $scope.businessAddresses.push(addressDetails);
        $scope.createDeliveryZones();
    };

    $scope.addNewBusinessAddress = function() {
        $scope.isAddBusinessAddressFormHidden = false;
    };

    $scope.addPackageItem = function() {
        $scope.packageItems.push({});
    };

    $scope.createDeliveryZones = function() {
        $scope.deliveryZones = [];

        $scope.businessAddresses.forEach(function(businessAddress, index) {
            $scope.deliveryZones.push({
                id: index,
                center: {
                    latitude: businessAddress.latitude,
                    longitude: businessAddress.longitude
                },
                fill: {
                    color: '#ff0000',
                    opacity: .3
                },
                radius: businessAddress.deliveryRadius * 1609.344, // Metres.
                stroke: {
                    weight: 0
                }
            });
        });

        $scope.map.refresh = true;
    };

    $scope.createPackage = function(createPackageForm) {
        if (!createPackageForm.$valid) {
            return;
        }

        LoadingService.show();

        $scope.createPackageError = null;

        var deliveryRadiuses = new Map();

        $scope.businessAddresses.forEach(function(businessAddress) {
            deliveryRadiuses.set(businessAddress._id, businessAddress.deliveryRadius);
        });

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
            // @todo – confirm a map is the correct format.
            deliveryRadiuses: deliveryRadiuses,
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
    };
});
