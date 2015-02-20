angular.module('cp').directive('cpPackageForm', function($anchorScroll, $cookies, $location, $q,
        $window, LoadingService, AddressFactory, PackagesFactory, VendorsFactory, uiGmapGoogleMapApi) {
    return {
        restrict: 'E',
        scope: {
            destination: '@cpDestination',
            operation: '@cpOperation',
            package: '=cpPackage',
            submitValue: '@cpSubmitValue'
        },
        controller: function($scope) {
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
            $scope.quantityOptions = PackagesFactory.getQuantityOptions();
            $scope.radiusOptions = PackagesFactory.getRadiusOptions();
            $scope.vendor.addresses = [];

            function init() {
                let promise1 = PackagesFactory.getAllergenTypes().success(response => {
                    $scope.allergenTypeOptions = response.allergenTypes;
                });
                let promise2 = PackagesFactory.getDietaryTypes().success(response => {
                    var dietaryTypes = response.dietaryRequirements;

                    dietaryTypes.forEach(dietaryType => {
                        $scope.dietaryTypeOptions.push({
                            name: dietaryType.name,
                            notes: null
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
                    $scope.vendor.addresses = response.addresses;

                    // Set address defaults.
                    $scope.vendor.addresses.forEach(function(address) {
                        address.deliveryRadius = 2;
                        address.isSelected = true;
                    });
                });

                $q.all([promise1, promise2, promise3, promise4, promise5]).then(() => {
                    $scope.createDeliveryZones();
                    LoadingService.hide()
                });
            }

            init();

            uiGmapGoogleMapApi.then(function(maps) {
                // @todo – latitude and longitude should be constants.
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
                    $scope.vendor.addresses = response.addresses;
                    $scope.createDeliveryZones();
                    LoadingService.hide();
                });
            };

            $scope.addAnotherAddress = function() {
                $scope.isAddAddressFormHidden = false;
            };

            $scope.addPackageItem = function() {
                $scope.package.items.push({});
            };

            $scope.createDeliveryZones = function() {
                $scope.deliveryZones = [];

                $scope.vendor.addresses.forEach(function(address, index) {
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

            $scope.submit = function() {
                if (!$scope.packageForm.$valid) {
                    return;
                }

                LoadingService.show();

                $scope.packageFormError = null;

                var deliveryRadiuses = new Map();

                $scope.vendor.addresses.forEach(function(address) {
                    if (address.isSelected) {
                        deliveryRadiuses.set(address._id, address.deliveryRadius);
                    }
                });

                const packageDetails = {
                    cuisineType: $scope.package.cuisineType,
                    name: $scope.package.name,
                    shortDescription: $scope.package.shortDescription ? $scope.package.shortDescription : null,
                    description: $scope.package.description,
                    items: ($scope.package.items.length > 0) ? $scope.package.items : null,
                    dietaryRequirements: ($scope.package.dietaryTypes.length > 0) ? $scope.package.dietaryTypes : null,
                    allergenTypes: ($scope.package.allergenTypes.length > 0) ? $scope.package.allergenTypes : null,
                    eventTypes: ($scope.package.eventTypes.length > 0) ? $scope.package.eventTypes : null,
                    hotFood: $scope.package.hotFood,
                    costIncludingVat: $scope.package.cost,
                    // @todo – confirm a map is the correct format.
                    deliveryRadiuses: deliveryRadiuses,
                    minPeople: $scope.package.minPeople,
                    maxPeople: $scope.package.maxPeople,
                    notice: $scope.package.notice,
                    deliveryDays: $scope.package.deliveryDays,
                    deliveryTimeStart: $scope.package.deliveryTimeStart,
                    deliveryTimeEnd: $scope.package.deliveryTimeEnd,
                    deliveryCostIncludingVat: $scope.package.deliveryCost,
                    freeDeliveryThreshold: $scope.package.freeDeliveryThreshold,
                    vendor: $cookies.vendorId
                };

                var packageArguments = [packageDetails];

                if ($scope.operation === 'update') {
                    packageArguments.unshift($scope.package.id);
                }

                PackagesFactory[$scope.operation + 'Package'].apply(this, packageArguments)
                    .success(response => {
                        $window.location = $scope.destination;
                    })
                    .catch(response => {
                        $scope.packageFormError = response.data.errorTranslation;
                        LoadingService.hide();
                    });
            };
        },
        templateUrl: '/dist/templates/vendor/vendor-package.html'
    };
});
