angular.module('cp').directive('cpPackageForm', function(getTemplateUrl) {
    return {
        restrict: 'E',
        scope: {
            destination: '@cpDestination',
            operation: '@cpOperation',
            package: '=cpPackage',
            showNotification: '@cpShowNotification',
            submitValue: '@cpSubmitValue'
        },
        controller: 'cpPackageFormController',
        templateUrl: getTemplateUrl('directives/cp-package-form.html')
    };
});

angular.module('cp').controller('cpPackageFormController', function($scope, $location, $q,
        LoadingService, AddressFactory, PackagesFactory, uiGmapGoogleMapApi,
        MAP_CENTER, NotificationService, SecurityService, ApiService, API_BASE, $upload) {
    $scope.newAddress = {countryName: 'United Kingdom'};
    $scope.allergenTypeOptions = [];
    $scope.cuisineTypeOptions = [];
    $scope.deliveryDayOptions = PackagesFactory.getDeliveryDayOptions();
    $scope.deliveryTimeOptions = PackagesFactory.getPackageDeliveryTimeOptions(700, 2400, 30);
    $scope.deliveryZones = [];
    $scope.dietaryTypeOptions = [];
    $scope.eventTypeOptions = [];
    $scope.isAddAddressFormOpen = false;
    $scope.map = {};
    $scope.noticeOptions = PackagesFactory.getNoticeOptions();
    $scope.quantityOptions = PackagesFactory.getQuantityOptions();
    $scope.radiusOptions = PackagesFactory.getRadiusOptions();
    $scope.packagingTypeOptions = PackagesFactory.getPackagingTypeOptions();
    $scope.vendor = {};

    function init() {
        const promise0 = SecurityService.getVendor()
            .then(vendor => $scope.vendor = vendor);
        const promise1 = PackagesFactory.getAllergenTypes()
            .success(response => $scope.allergenTypeOptions = response.allergenTypes);
        const promise2 = PackagesFactory.getDietaryTypes().success(response => {
            var dietaryTypes = response.dietaryRequirements;

            dietaryTypes.forEach(dietaryType => {
                $scope.dietaryTypeOptions.push({
                    name: dietaryType.name,
                    notes: ''
                });
            });
        });
        const promise3 = PackagesFactory.getEventTypes()
            .success(response => $scope.eventTypeOptions = response.eventTypes);
        const promise4 = PackagesFactory.getCuisineTypes()
            .success(response => $scope.cuisineTypeOptions = response.cuisineTypes);

        $q.all([promise0, promise1, promise2, promise3, promise4]).then(() => {
            $scope.setDefaultValuesForAddresses();
            $scope.createDeliveryZones();
            LoadingService.hide();
        });
    }

    init();

    uiGmapGoogleMapApi.then(function(maps) {
        $scope.map = {
            center: MAP_CENTER,
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
            addressLine1: $scope.newAddress.addressLine1,
            addressLine2: $scope.newAddress.addressLine2 ? $scope.newAddress.addressLine2 : null,
            addressLine3: $scope.newAddress.addressLine3 ? $scope.newAddress.addressLine3 : null,
            city: $scope.newAddress.city,
            county: $scope.newAddress.county ? $scope.newAddress.county : null,
            postcode: $scope.newAddress.postcode,
            countryName: $scope.newAddress.countryName,
            landlineNumber: $scope.newAddress.landlineNumber,
            orderNotificationMobileNumbers: $scope.newAddress.orderNotificationMobileNumbersCommaSeparated.split(/\s*,\s*/),
            contactName: $scope.newAddress.contactName
        };

        AddressFactory.createAddress(addressDetails)
            .success(response => {
                $scope.isAddAddressFormOpen = false;

                // Reset address form fields.
                $scope.newAddress = {countryName: 'United Kingdom'};

                response.newAddress.isSelected = true;
                response.newAddress.deliveryRadius = 2;

                $scope.vendor.addresses.push(response.newAddress);

                if (!$scope.package.deliveryRadiuses) {
                    $scope.package.deliveryRadiuses = {};
                }
                $scope.package.deliveryRadiuses[response.newAddress.id] = 2;

                $scope.createDeliveryZones();

                LoadingService.hide();
            })
            .catch(response => $scope.addAddressError = response.data.errorTranslation);
    };

    $scope.addAnotherAddress = function() {
        $scope.isAddAddressFormOpen = true;
    };

    $scope.addPackageItem = function() {
        $scope.package.items.push('');
    };

    $scope.createDeliveryZones = function() {
        $scope.deliveryZones = [];

        $scope.vendor.addresses.forEach(function(address, index) {
            if (!address.isSelected) {
                return;
            }

            $scope.deliveryZones.push({
                id: index,
                center: {
                    latitude: address.latitude,
                    longitude: address.longitude
                },
                fill: {
                    color: '#ff0000',
                    opacity: 0.3
                },
                radius: address.deliveryRadius * 1609.344, // Metres.
                stroke: {
                    weight: 0
                }
            });
        });

        $scope.map.refresh = true;
    };

    $scope.setDefaultValuesForAddresses = function() {
        $scope.vendor.addresses.forEach(vendorAddress => {
            for (let addressId in $scope.package.deliveryRadiuses) {
                if (vendorAddress.id === addressId) {
                    vendorAddress.deliveryRadius = $scope.package.deliveryRadiuses[addressId];
                    vendorAddress.isSelected = true;
                }
            }
        });
    };

    $scope.hasAtLeastOneAddressSelected = function(addresses) {
        let result = false;

        addresses.forEach(address => {
            if (address.isSelected) {
                result = true;
                return;
            }
        });

        return result;
    };

    $scope.isDietaryTypeSelected = function(dietaryType) {
        for (let i = 0; i < $scope.package.dietaryRequirements.length; i++) {
            let dietaryRequirement = $scope.package.dietaryRequirements[i];

            if (dietaryType.name === dietaryRequirement.name) {
                dietaryType.notes = dietaryRequirement.notes;
                $scope.package.dietaryRequirements.splice(i, 1, dietaryType);
                return true;
            }
        }
        return false;
    };

    $scope.deleteImage = (imageIndex) => {
        $scope.package.images.splice(imageIndex, 1);
    };

    $scope.setCoverImage = (imageIndex) => {
        $scope.package.images.unshift($scope.package.images.splice(imageIndex, 1).pop());
    };

    $scope.setDefaultValuesForAddresses = function() {
        $scope.vendor.addresses.forEach(vendorAddress => {
            for (let addressId in $scope.package.deliveryRadiuses) {
                if (vendorAddress.id === addressId) {
                    vendorAddress.deliveryRadius = $scope.package.deliveryRadiuses[addressId];
                    vendorAddress.isSelected = true;
                }
            }
        });
    };

    $scope.submit = function() {
        if (!$scope.packageForm.$valid) {
            $scope.packageForm.$submitted = true;
            return;
        }

        LoadingService.show();

        $scope.packageFormError = undefined;

        const deliveryRadiuses = {};

        $scope.vendor.addresses.forEach(function(address) {
            if (address.isSelected) {
                deliveryRadiuses[address.id] = Number(address.deliveryRadius);
            }
        });

        const packageDetails = {
            cuisineType: $scope.package.cuisineType.id,
            name: $scope.package.name,
            shortDescription: $scope.package.shortDescription ? $scope.package.shortDescription : null,
            description: $scope.package.description,
            images: $scope.package.images,
            items: ($scope.package.items.length > 0) ? $scope.package.items : [],
            dietaryRequirements: ($scope.package.dietaryRequirements.length > 0) ? $scope.package.dietaryRequirements : [],
            allergenTypes: ($scope.package.allergenTypes.length > 0) ? $scope.package.allergenTypes : [],
            eventTypes: ($scope.package.eventTypes.length > 0) ? $scope.package.eventTypes : [],
            hotFood: $scope.package.hotFood,
            costIncludingVat: $scope.package.costIncludingVat,
            costOfVat: $scope.package.costOfVat,
            deliveryRadiuses: deliveryRadiuses,
            minPeople: $scope.package.minPeople,
            maxPeople: $scope.package.maxPeople,
            notice: $scope.package.notice,
            deliveryDays: $scope.package.deliveryDays,
            deliveryTimeStart: $scope.package.deliveryTimeStart,
            deliveryTimeEnd: $scope.package.deliveryTimeEnd,
            deliveryCostIncludingVat: $scope.package.deliveryCostIncludingVat,
            freeDeliveryThreshold: $scope.package.freeDeliveryThreshold,
            canDeliverCutleryAndServiettes: $scope.package.canDeliverCutleryAndServiettes,
            canSetUpAfterDelivery: $scope.package.canSetUpAfterDelivery,
            costToSetUpAfterDelivery: Number($scope.package.costToSetUpAfterDelivery),
            canCleanUpAfterDelivery: $scope.package.canCleanUpAfterDelivery,
            costToCleanUpAfterDelivery: Number($scope.package.costToCleanUpAfterDelivery),
            packagingType: $scope.package.packagingType
        };

        var packageArguments = [packageDetails];

        if ($scope.operation === 'update') {
            packageArguments.unshift($scope.package.id);
        }

        PackagesFactory[$scope.operation + 'Package'].apply(this, packageArguments)
            .success(response => {
                LoadingService.hide();

                if ($scope.showNotification) {
                    let notificationMessage;

                    if ($scope.operation === 'create') {
                        notificationMessage = 'Your package has been created.';
                    } else if ($scope.operation === 'update') {
                        notificationMessage = 'Your package has been updated.';
                    }
                    NotificationService.notifySuccess(notificationMessage);
                }

                $location.path($scope.destination);
            })
            .catch(response => {
                // One vendor has reported the loading animation spins forever when trying to create
                // their page. A possible cause of this is there is an error in the 'success' block,
                // meaning 'response' is not a response object as we have been expected.
                // @todo - revert this debugging code once the issue has been resolved.
                if (response && response.data && response.data.errorTranslation) {
                    $scope.packageFormError = response.data.errorTranslation;
                }
                NotificationService.notifyError($scope.packageFormError);
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
                url: API_BASE + '/packages/upload-image' + ($scope.package.id ? '?id=' + $scope.package.id : ''),
                file: file,
                headers: ApiService.getAllHeaders()
            }).success(response => {
                if ($scope.package.images === undefined) {
                    $scope.package.images = [];
                }

                $scope.package.images.push({
                    original: response.paths.originalUrl,
                    large: response.paths.largeUrl,
                    medium: response.paths.mediumUrl,
                    thumbnail: response.paths.thumbnailUrl
                });

                LoadingService.hide();
            })
            .error(response => NotificationService.notifyError(response.data.errorTranslation));
        }
    };
});
