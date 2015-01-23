angular.module('cp.controllers.general').controller('NewsletterController',
        function($scope, $http, API_BASE, $window) {
    $scope.subscribe = function() {
        $http.post(API_BASE + '/newsletter/subscribe', {email: $scope.email}).then(function(response) {
            $scope.success = true;
        }).catch(function(response) {
            console.log('error', response);
        })
    };
});
