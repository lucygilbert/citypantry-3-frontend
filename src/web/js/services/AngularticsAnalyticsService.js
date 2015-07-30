/**
 * Service for tracking via Angulartics, which pushes events to Segment, HubSpot, and more.
 */
angular.module('cp.services').service('AngularticsAnalyticsService', function($analytics,
        ENABLE_ANGULARTICS) {
    const service = {
        trackPackageView(pkg) {
            $analytics.eventTrack('packageView', {
                id: pkg.id,
                name: pkg.name,
                cuisineType: pkg.cuisineType.name,
                vendor: pkg.vendor.name
            });
        },

        trackSearchAndResults(packageResults, searchCriteria) {
            $analytics.eventTrack('searchAndResults', {
                date: searchCriteria.date,
                time: searchCriteria.time,
                headCount: searchCriteria.headCount,
                deliveryPostcode: searchCriteria.postcode,
                budget: searchCriteria.maxBudget,
                eventType: searchCriteria.eventTypes,
                cuisineTypes: searchCriteria.cuisineTypes,
                dietaryRequirements: searchCriteria.dietaryRequirements,
                numberOfResults: packageResults.length
            });
        },

        trackIncreasingSearchResultsPagination(newPageNumber) {
            $analytics.eventTrack('showMoreFood', {
                pageNumber: newPageNumber
            });
        },

        trackPackageImageCarouselChange(newImageIndex) {
            $analytics.eventTrack('packageImageCarouselChange', {
                newImageIndex: newImageIndex
            });
        },

        trackAdvancedSearchToggle(isNowOpen) {
            $analytics.eventTrack('advancedSearchToggle', {
                newState: isNowOpen ? 'opened' : 'closed'
            });
        },

        trackOpeningCheckoutPromoCodeField() {
            $analytics.eventTrack('checkoutPromoCodeFieldOpen', {
                newState: 'opened'
            });
        },

        trackNotificationModal(type, message) {
            $analytics.eventTrack('notificationModal', {
                type,
                message
            });
        }
    };

    if (!ENABLE_ANGULARTICS) {
        // Replace all service methods with a no-op, so Jasmine unit tests can still run without
        // actually calling Angulartics.
        angular.forEach(service, (original, methodName) => {
            service[methodName] = angular.noop;
        });
    }

    return service;
});
