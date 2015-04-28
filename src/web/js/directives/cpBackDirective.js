angular.module('cp.controllers.general').directive('cpBack', function($window, $location) {
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
            });
        }
    };
});
