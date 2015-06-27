angular.module('cp.services').service('CheckoutService', function($window) {
    let deliveryAddressId;
    let deliveryCost;
    let deliveryDate;
    let dietaryRequirementsExtra;
    let endTime;
    let headCount;
    let isCutleryAndServiettesRequired = false;
    let isVendorRequiredToCleanUp = false;
    let isVendorRequiredToSetUp = false;
    let packageId;
    let packagingType;
    let postcode;
    let promoCodeId;
    let startTime;
    let subTotalAmount;
    let totalAmount;
    let vegetarianHeadCount;
    let vendorCleanupCost;
    let vendorSetupCost;
    let lastCreatedOrder;

    // This prefix constant is versioned so we can make changes to what is stored, without having
    // to ask users to clear their local storage manually.
    const LOCAL_STORAGE_PREFIX = 'CheckoutServiceV1~';
    const getPersistedValue = (key) => $window.localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    const setPersistedValue = (key, value) => $window.localStorage.setItem(LOCAL_STORAGE_PREFIX + key, value);
    const removePersistedValue = (key) => $window.localStorage.removeItem(LOCAL_STORAGE_PREFIX + key);

    return {
        getDeliveryAddressId: function() {
            if (deliveryAddressId !== undefined) {
                return deliveryAddressId;
            } else if (getPersistedValue('deliveryAddressId') !== null) {
                return getPersistedValue('deliveryAddressId');
            } else {
                return undefined;
            }
        },

        setDeliveryAddressId: function(value) {
            if (value !== undefined) {
                deliveryAddressId = value;
                setPersistedValue('deliveryAddressId', value);
            }
        },

        getDeliveryCost: function() {
            if (deliveryCost !== undefined) {
                return deliveryCost;
            } else if (getPersistedValue('deliveryCost') !== null) {
                return parseFloat(getPersistedValue('deliveryCost'));
            } else {
                return undefined;
            }
        },

        setDeliveryCost: function(value) {
            if (value !== undefined) {
                deliveryCost = value;
                setPersistedValue('deliveryCost', value);
            }
        },

        getDeliveryDate: function() {
            if (deliveryDate !== undefined) {
                return deliveryDate;
            } else if (getPersistedValue('deliveryDate') !== null) {
                return new Date(getPersistedValue('deliveryDate'));
            } else {
                return undefined;
            }
        },

        setDeliveryDate: function(value) {
            if (value !== undefined) {
                deliveryDate = value;
                setPersistedValue('deliveryDate', value);
            }
        },

        getDietaryRequirementsExtra: function() {
            if (dietaryRequirementsExtra !== undefined) {
                return dietaryRequirementsExtra;
            } else if (getPersistedValue('dietaryRequirementsExtra') !== null) {
                return getPersistedValue('dietaryRequirementsExtra');
            } else {
                return undefined;
            }
        },

        setDietaryRequirementsExtra: function(value) {
            if (value !== undefined) {
                dietaryRequirementsExtra = value;
                setPersistedValue('dietaryRequirementsExtra', value);
            }
        },

        getEndTime: function() {
            if (endTime !== undefined) {
                return endTime;
            } else if (getPersistedValue('endTime') !== null) {
                return new Date(getPersistedValue('endTime'));
            } else {
                return undefined;
            }
        },

        setEndTime: function(value) {
            if (value !== undefined) {
                endTime = value;
                setPersistedValue('endTime', value);
            }
        },

        getHeadCount: function() {
            if (headCount !== undefined) {
                return headCount;
            } else if (getPersistedValue('headCount') !== null) {
                return parseInt(getPersistedValue('headCount'), 10);
            } else {
                return undefined;
            }
        },

        setHeadCount: function(value) {
            if (value !== undefined) {
                headCount = value;
                setPersistedValue('headCount', value);
            }
        },

        getPackageId: function() {
            if (packageId !== undefined) {
                return packageId;
            } else if (getPersistedValue('packageId') !== null) {
                return getPersistedValue('packageId');
            } else {
                return undefined;
            }
        },

        setPackageId: function(value) {
            if (value !== undefined) {
                packageId = value;
                setPersistedValue('packageId', value);
            }
        },

        getPackagingType: function() {
            if (packagingType !== undefined) {
                return packagingType;
            } else if (getPersistedValue('packagingType') !== null) {
                return parseInt(getPersistedValue('packagingType'), 10);
            } else {
                return undefined;
            }
        },

        setPackagingType: function(value) {
            if (value !== undefined) {
                packagingType = value;
                setPersistedValue('packagingType', value);
            }
        },

        getPostcode: function() {
            if (postcode !== undefined) {
                return postcode;
            } else if (getPersistedValue('postcode') !== null) {
                return getPersistedValue('postcode');
            } else {
                return undefined;
            }
        },

        setPostcode: function(value) {
            if (value !== undefined) {
                postcode = value;
                setPersistedValue('postcode', value);
            }
        },

        getPromoCodeId: function() {
            if (promoCodeId !== undefined) {
                return promoCodeId;
            } else if (getPersistedValue('promoCodeId') !== null) {
                return getPersistedValue('promoCodeId');
            } else {
                return undefined;
            }
        },

        setPromoCodeId: function(value) {
            if (value !== undefined) {
                promoCodeId = value;
                setPersistedValue('promoCodeId', value);
            }
        },

        getStartTime: function() {
            if (startTime !== undefined) {
                return startTime;
            } else if (getPersistedValue('startTime') !== null) {
                return new Date(getPersistedValue('startTime'));
            } else {
                return undefined;
            }
        },

        setStartTime: function(value) {
            if (value !== undefined) {
                startTime = value;
                setPersistedValue('startTime', value);
            }
        },

        getSubTotalAmount: function() {
            if (subTotalAmount !== undefined) {
                return subTotalAmount;
            } else if (getPersistedValue('startsubTotalAmountTime') !== null) {
                return parseFloat(getPersistedValue('subTotalAmount'));
            } else {
                return undefined;
            }
        },

        setSubTotalAmount: function(value) {
            if (value !== undefined) {
                subTotalAmount = value;
                setPersistedValue('subTotalAmount', value);
            }
        },

        getTotalAmount: function() {
            if (totalAmount !== undefined) {
                return totalAmount;
            } else if (getPersistedValue('totalAmount') !== null) {
                return parseFloat(getPersistedValue('totalAmount'));
            } else {
                return undefined;
            }
        },

        setTotalAmount: function(value) {
            if (value !== undefined) {
                totalAmount = value;
                setPersistedValue('totalAmount', value);
            }
        },

        getVendorCleanupCost: function() {
            if (vendorCleanupCost !== undefined) {
                return vendorCleanupCost;
            } else if (getPersistedValue('vendorCleanupCost') !== null) {
                return parseFloat(getPersistedValue('vendorCleanupCost'));
            } else {
                return undefined;
            }
        },

        setVendorCleanupCost: function(value) {
            if (value !== undefined) {
                vendorCleanupCost = value;
                setPersistedValue('vendorCleanupCost', value);
            }
        },

        getVendorSetupCost: function() {
            if (vendorSetupCost !== undefined) {
                return vendorSetupCost;
            } else if (getPersistedValue('vendorSetupCost') !== null) {
                return parseFloat(getPersistedValue('vendorSetupCost'));
            } else {
                return undefined;
            }
        },

        setVendorSetupCost: function(value) {
            if (value !== undefined) {
                vendorSetupCost = value;
                setPersistedValue('vendorSetupCost', value);
            }
        },

        getVegetarianHeadCount: function() {
            if (vegetarianHeadCount !== undefined) {
                return vegetarianHeadCount;
            } else if (getPersistedValue('vegetarianHeadCount') !== null) {
                return parseInt(getPersistedValue('vegetarianHeadCount'), 10);
            } else {
                return undefined;
            }
        },

        setVegetarianHeadCount: function(value) {
            if (value !== undefined) {
                vegetarianHeadCount = value;
                setPersistedValue('vegetarianHeadCount', value);
            }
        },

        isCutleryAndServiettesRequired: function() {
            if (isCutleryAndServiettesRequired !== undefined) {
                return isCutleryAndServiettesRequired;
            } else if (getPersistedValue('isCutleryAndServiettesRequired') !== null) {
                return getPersistedValue('isCutleryAndServiettesRequired');
            } else {
                return undefined;
            }
        },

        setIsCutleryAndServiettesRequired: function(value) {
            if (value !== undefined) {
                isCutleryAndServiettesRequired = value;
                setPersistedValue('isCutleryAndServiettesRequired', value);
            }
        },

        isVendorRequiredToCleanUp: function() {
            if (isVendorRequiredToCleanUp !== undefined) {
                return isVendorRequiredToCleanUp;
            } else if (getPersistedValue('isVendorRequiredToCleanUp') !== null) {
                return getPersistedValue('isVendorRequiredToCleanUp');
            } else {
                return undefined;
            }
        },

        setIsVendorRequiredToCleanUp: function(value) {
            if (value !== undefined) {
                isVendorRequiredToCleanUp = value;
                setPersistedValue('isVendorRequiredToCleanUp', value);
            }
        },

        isVendorRequiredToSetUp: function() {
            if (isVendorRequiredToSetUp !== undefined) {
                return isVendorRequiredToSetUp;
            } else if (getPersistedValue('isVendorRequiredToSetUp') !== null) {
                return getPersistedValue('isVendorRequiredToSetUp');
            } else {
                return undefined;
            }
        },

        setIsVendorRequiredToSetUp: function(value) {
            if (value !== undefined) {
                isVendorRequiredToSetUp = value;
                setPersistedValue('isVendorRequiredToSetUp', value);
            }
        },

        getLastCreatedOrder: function() {
            if (lastCreatedOrder !== undefined) {
                return lastCreatedOrder;
            } else if (getPersistedValue('lastCreatedOrder') !== null) {
                return JSON.parse(getPersistedValue('lastCreatedOrder'));
            } else {
                return undefined;
            }
        },

        setLastCreatedOrder: function(value) {
            if (value !== undefined) {
                lastCreatedOrder = value;
                setPersistedValue('lastCreatedOrder', JSON.stringify(lastCreatedOrder));
            }
        },

        reset: function() {
            dietaryRequirementsExtra = undefined;
            isCutleryAndServiettesRequired = false;
            isVendorRequiredToCleanUp = false;
            isVendorRequiredToSetUp = false;
            packagingType = undefined;
            vegetarianHeadCount = undefined;
            deliveryAddressId = undefined;
            deliveryCost = undefined;
            deliveryDate = undefined;
            endTime = undefined;
            headCount = undefined;
            packageId = undefined;
            postcode = undefined;
            promoCodeId = undefined;
            subTotalAmount = undefined;
            totalAmount = undefined;
            vendorCleanupCost = undefined;
            vendorSetupCost = undefined;

            removePersistedValue('dietaryRequirementsExtra');
            removePersistedValue('isCutleryAndServiettesRequired');
            removePersistedValue('isVendorRequiredToCleanUp');
            removePersistedValue('isVendorRequiredToSetUp');
            removePersistedValue('packagingType');
            removePersistedValue('vegetarianHeadCount');
            removePersistedValue('postcode');
            removePersistedValue('promoCodeId');
            removePersistedValue('vendorSetupCost');
            removePersistedValue('vendorCleanupCost');
            removePersistedValue('deliveryAddressId');
            removePersistedValue('deliveryCost');
            removePersistedValue('deliveryDate');

            // Deliberately do not reset 'lastCreatedOrder' or 'startTime', because they are used in
            // the 'thank you' page.
        }
    };
});
