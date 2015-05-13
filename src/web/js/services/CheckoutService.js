angular.module('cp.services').service('CheckoutService', function($window) {
    var deliveryAddressId;
    var deliveryCost;
    var deliveryDate;
    var dietaryRequirementsExtra;
    var endTime;
    var headCount;
    var isCutleryAndServiettesRequired = false;
    var isVendorRequiredToCleanUp = false;
    var isVendorRequiredToSetUp = false;
    var packageId;
    var packagingType;
    var postcode;
    var promoCodeId;
    var startTime;
    var subTotalAmount;
    var totalAmount;
    var vegetarianHeadCount;
    var vendorCleanupCost;
    var vendorSetupCost;
    let lastCreatedOrder;

    return {
        getDeliveryAddressId: function() {
            if (deliveryAddressId !== undefined) {
                return deliveryAddressId;
            } else if ($window.localStorage.getItem('deliveryAddressId') !== null) {
                return $window.localStorage.getItem('deliveryAddressId');
            } else {
                return undefined;
            }
        },

        setDeliveryAddressId: function(value) {
            if (value !== undefined) {
                deliveryAddressId = value;
                $window.localStorage.setItem('deliveryAddressId', value);
            }
        },

        getDeliveryCost: function() {
            if (deliveryCost !== undefined) {
                return deliveryCost;
            } else if ($window.localStorage.getItem('deliveryCost') !== null) {
                return parseFloat($window.localStorage.getItem('deliveryCost'));
            } else {
                return undefined;
            }
        },

        setDeliveryCost: function(value) {
            if (value !== undefined) {
                deliveryCost = value;
                $window.localStorage.setItem('deliveryCost', value);
            }
        },

        getDeliveryDate: function() {
            if (deliveryDate !== undefined) {
                return deliveryDate;
            } else if ($window.localStorage.getItem('deliveryDate') !== null) {
                return new Date($window.localStorage.getItem('deliveryDate'));
            } else {
                return undefined;
            }
        },

        setDeliveryDate: function(value) {
            if (value !== undefined) {
                deliveryDate = value;
                $window.localStorage.setItem('deliveryDate', value);
            }
        },

        getDietaryRequirementsExtra: function() {
            if (dietaryRequirementsExtra !== undefined) {
                return dietaryRequirementsExtra;
            } else if ($window.localStorage.getItem('dietaryRequirementsExtra') !== null) {
                return $window.localStorage.getItem('dietaryRequirementsExtra');
            } else {
                return undefined;
            }
        },

        setDietaryRequirementsExtra: function(value) {
            if (value !== undefined) {
                dietaryRequirementsExtra = value;
                $window.localStorage.setItem('dietaryRequirementsExtra', value);
            }
        },

        getEndTime: function() {
            if (endTime !== undefined) {
                return endTime;
            } else if ($window.localStorage.getItem('endTime') !== null) {
                return new Date($window.localStorage.getItem('endTime'));
            } else {
                return undefined;
            }
        },

        setEndTime: function(value) {
            if (value !== undefined) {
                endTime = value;
                $window.localStorage.setItem('endTime', value);
            }
        },

        getHeadCount: function() {
            if (headCount !== undefined) {
                return headCount;
            } else if ($window.localStorage.getItem('headCount') !== null) {
                return parseInt($window.localStorage.getItem('headCount'), 10);
            } else {
                return undefined;
            }
        },

        setHeadCount: function(value) {
            if (value !== undefined) {
                headCount = value;
                $window.localStorage.setItem('headCount', value);
            }
        },

        getPackageId: function() {
            if (packageId !== undefined) {
                return packageId;
            } else if ($window.localStorage.getItem('packageId') !== null) {
                return $window.localStorage.getItem('packageId');
            } else {
                return undefined;
            }
        },

        setPackageId: function(value) {
            if (value !== undefined) {
                packageId = value;
                $window.localStorage.setItem('packageId', value);
            }
        },

        getPackagingType: function() {
            if (packagingType !== undefined) {
                return packagingType;
            } else if ($window.localStorage.getItem('packagingType') !== null) {
                return parseInt($window.localStorage.getItem('packagingType'), 10);
            } else {
                return undefined;
            }
        },

        setPackagingType: function(value) {
            if (value !== undefined) {
                packagingType = value;
                $window.localStorage.setItem('packagingType', value);
            }
        },

        getPostcode: function() {
            if (postcode !== undefined) {
                return postcode;
            } else if ($window.localStorage.getItem('postcode') !== null) {
                return $window.localStorage.getItem('postcode');
            } else {
                return undefined;
            }
        },

        setPostcode: function(value) {
            if (value !== undefined) {
                postcode = value;
                $window.localStorage.setItem('postcode', value);
            }
        },

        getPromoCodeId: function() {
            if (promoCodeId !== undefined) {
                return promoCodeId;
            } else if ($window.localStorage.getItem('promoCodeId') !== null) {
                return $window.localStorage.getItem('promoCodeId');
            } else {
                return undefined;
            }
        },

        setPromoCodeId: function(value) {
            if (value !== undefined) {
                promoCodeId = value;
                $window.localStorage.setItem('promoCodeId', value);
            }
        },

        getStartTime: function() {
            if (startTime !== undefined) {
                return startTime;
            } else if ($window.localStorage.getItem('startTime') !== null) {
                return new Date($window.localStorage.getItem('startTime'));
            } else {
                return undefined;
            }
        },

        setStartTime: function(value) {
            if (value !== undefined) {
                startTime = value;
                $window.localStorage.setItem('startTime', value);
            }
        },

        getSubTotalAmount: function() {
            if (subTotalAmount !== undefined) {
                return subTotalAmount;
            } else if ($window.localStorage.getItem('startsubTotalAmountTime') !== null) {
                return parseFloat($window.localStorage.getItem('subTotalAmount'));
            } else {
                return undefined;
            }
        },

        setSubTotalAmount: function(value) {
            if (value !== undefined) {
                subTotalAmount = value;
                $window.localStorage.setItem('subTotalAmount', value);
            }
        },

        getTotalAmount: function() {
            if (totalAmount !== undefined) {
                return totalAmount;
            } else if ($window.localStorage.getItem('totalAmount') !== null) {
                return parseFloat($window.localStorage.getItem('totalAmount'));
            } else {
                return undefined;
            }
        },

        setTotalAmount: function(value) {
            if (value !== undefined) {
                totalAmount = value;
                $window.localStorage.setItem('totalAmount', value);
            }
        },

        getVendorCleanupCost: function() {
            if (vendorCleanupCost !== undefined) {
                return vendorCleanupCost;
            } else if ($window.localStorage.getItem('vendorCleanupCost') !== null) {
                return parseFloat($window.localStorage.getItem('vendorCleanupCost'));
            } else {
                return undefined;
            }
        },

        setVendorCleanupCost: function(value) {
            if (value !== undefined) {
                vendorCleanupCost = value;
                $window.localStorage.setItem('vendorCleanupCost', value);
            }
        },

        getVendorSetupCost: function() {
            if (vendorSetupCost !== undefined) {
                return vendorSetupCost;
            } else if ($window.localStorage.getItem('vendorSetupCost') !== null) {
                return parseFloat($window.localStorage.getItem('vendorSetupCost'));
            } else {
                return undefined;
            }
        },

        setVendorSetupCost: function(value) {
            if (value !== undefined) {
                vendorSetupCost = value;
                $window.localStorage.setItem('vendorSetupCost', value);
            }
        },

        getVegetarianHeadCount: function() {
            if (vegetarianHeadCount !== undefined) {
                return vegetarianHeadCount;
            } else if ($window.localStorage.getItem('vegetarianHeadCount') !== null) {
                return parseInt($window.localStorage.getItem('vegetarianHeadCount'), 10);
            } else {
                return undefined;
            }
        },

        setVegetarianHeadCount: function(value) {
            if (value !== undefined) {
                vegetarianHeadCount = value;
                $window.localStorage.setItem('vegetarianHeadCount', value);
            }
        },

        isCutleryAndServiettesRequired: function() {
            if (isCutleryAndServiettesRequired !== undefined) {
                return isCutleryAndServiettesRequired;
            } else if ($window.localStorage.getItem('isCutleryAndServiettesRequired') !== null) {
                return $window.localStorage.getItem('isCutleryAndServiettesRequired');
            } else {
                return undefined;
            }
        },

        setIsCutleryAndServiettesRequired: function(value) {
            if (value !== undefined) {
                isCutleryAndServiettesRequired = value;
                $window.localStorage.setItem('isCutleryAndServiettesRequired', value);
            }
        },

        isVendorRequiredToCleanUp: function() {
            if (isVendorRequiredToCleanUp !== undefined) {
                return isVendorRequiredToCleanUp;
            } else if ($window.localStorage.getItem('isVendorRequiredToCleanUp') !== null) {
                return $window.localStorage.getItem('isVendorRequiredToCleanUp');
            } else {
                return undefined;
            }
        },

        setIsVendorRequiredToCleanUp: function(value) {
            if (value !== undefined) {
                isVendorRequiredToCleanUp = value;
                $window.localStorage.setItem('isVendorRequiredToCleanUp', value);
            }
        },

        isVendorRequiredToSetUp: function() {
            if (isVendorRequiredToSetUp !== undefined) {
                return isVendorRequiredToSetUp;
            } else if ($window.localStorage.getItem('isVendorRequiredToSetUp') !== null) {
                return $window.localStorage.getItem('isVendorRequiredToSetUp');
            } else {
                return undefined;
            }
        },

        setIsVendorRequiredToSetUp: function(value) {
            if (value !== undefined) {
                isVendorRequiredToSetUp = value;
                $window.localStorage.setItem('isVendorRequiredToSetUp', value);
            }
        },

        getLastCreatedOrder: function() {
            if (lastCreatedOrder !== undefined) {
                return lastCreatedOrder;
            } else if ($window.localStorage.getItem('lastCreatedOrder') !== null) {
                return JSON.parse($window.localStorage.getItem('lastCreatedOrder'));
            } else {
                return undefined;
            }
        },

        setLastCreatedOrder: function(value) {
            if (value !== undefined) {
                lastCreatedOrder = value;
                $window.localStorage.setItem('lastCreatedOrder', JSON.stringify(lastCreatedOrder));
            }
        },

        reset: function() {
            dietaryRequirementsExtra = undefined;
            isCutleryAndServiettesRequired = false;
            isVendorRequiredToCleanUp = false;
            isVendorRequiredToSetUp = false;
            packagingType = undefined;
            vegetarianHeadCount = undefined;

            $window.localStorage.removeItem('dietaryRequirementsExtra');
            $window.localStorage.removeItem('isCutleryAndServiettesRequired');
            $window.localStorage.removeItem('isVendorRequiredToCleanUp');
            $window.localStorage.removeItem('isVendorRequiredToSetUp');
            $window.localStorage.removeItem('packagingType');
            $window.localStorage.removeItem('vegetarianHeadCount');

            // Deliberately do not reset 'lastCreatedOrder'.
        }
    };
});
