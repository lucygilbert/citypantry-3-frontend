/**
 * Service for tracking via Angulartics, which pushes events to Segment, HubSpot, and more.
 */
angular.module('cp.services').service('AngularticsAnalyticsService', function($analytics) {
    return {
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
        }
    };
});
