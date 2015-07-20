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
        }
    };
});
