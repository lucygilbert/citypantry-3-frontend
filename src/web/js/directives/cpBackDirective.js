angular.module('cp.controllers.general').directive('cpBack', function($window, $location, $rootScope) {
    return {
        restrict: 'A',
        scope: {
            searchButton: '=cpSearchButton'
        },
        link: function($scope, element) {
            element.bind('click', () => {
                if ($scope.searchButton === true) {
                    $location.path('/search');
                } else {
                    $window.history.back();
                }

                try {
                    // Because this click event is outside of the Angular digest cycle, we must
                    // manually call $apply on $rootScope so the `$location.path()` call takes
                    // affect.
                    $rootScope.$apply();
                } catch (e) {
                    // Already in a digest -- ignore the error.
                }
            });
        }
    };
});
