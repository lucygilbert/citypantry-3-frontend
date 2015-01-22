angular.module('cp.controllers.general', [
]);

angular.module('cp.controllers.general').controller('ContactController',
        function($scope, $http, API_BASE, $cookies, $window) {
    var emailModal = $window.document.querySelector('#contact-modal');
    var thanksModal = $window.document.querySelector('#thanks-modal');

    $scope.showModal = function() {
        emailModal.style.display = 'block';
    };

    $scope.hideModal = function() {
        emailModal.style.display = 'none';
    };

    $scope.showThanks = function() {
        thanksModal.style.display = 'block';
    };

    $scope.submit = function() {
        var emailDetails = {
            name: $scope.name,
            email: $scope.email,
            message: $scope.message,
        };

        $http.post(API_BASE + '/contact/send-email', emailDetails).then(function(response) {
            $scope.hideModal();
            $scope.showThanks();
        }).catch(function(response) {
            console.log('error', response);
        })
    };
});
