angular.module('cp.services').service('SearchService', function() {
    var cuisineTypes = [];
    var deliveryDate;
    var deliveryTime;
    var dietaryRequirements = [];
    var displayedPackagesCount;
    var eventTypes = [];
    var headCount;
    var lastPackageSelected;
    var maxBudget;
    var packagingType;
    var postcode;

    return {
        getCuisineTypes: function() {
            return cuisineTypes;
        },

        setCuisineTypes: function(value) {
            cuisineTypes = value;
        },

        getDeliveryDate: function() {
            return deliveryDate;
        },

        setDeliveryDate: function(value) {
            deliveryDate = value;
        },

        getDeliveryTime: function() {
            return deliveryTime;
        },

        setDeliveryTime: function(value) {
            deliveryTime = value;
        },

        getDietaryRequirements: function() {
            return dietaryRequirements;
        },

        setDietaryRequirements: function(value) {
            dietaryRequirements = value;
        },

        getDisplayedPackagesCount: function() {
            return displayedPackagesCount;
        },

        setDisplayedPackagesCount: function(value) {
            displayedPackagesCount = value;
        },

        getEventTypes: function() {
            return eventTypes;
        },

        setEventTypes: function(value) {
            eventTypes = value;
        },

        getHeadCount: function() {
            return headCount;
        },

        setHeadCount: function(value) {
            headCount = value;
        },

        getLastPackageSelected: function() {
            return lastPackageSelected;
        },

        setLastPackageSelected: function(value) {
            lastPackageSelected = value;
        },

        getMaxBudget: function() {
            return maxBudget;
        },

        setMaxBudget: function(value) {
            maxBudget = value;
        },

        getPackagingType: function() {
            return packagingType;
        },

        setPackagingType: function(value) {
            packagingType = value;
        },

        getPostcode: function() {
            return postcode;
        },

        setPostcode: function(value) {
            postcode = value;
        },

        reset: function() {
            cuisineTypes = [];
            deliveryDate = undefined;
            deliveryTime = undefined;
            dietaryRequirements = [];
            displayedPackagesCount = undefined;
            eventTypes = [];
            headCount = undefined;
            lastPackageSelected = undefined;
            maxBudget = undefined;
            packagingType = undefined;
            postcode = undefined;
        }
    };
});
