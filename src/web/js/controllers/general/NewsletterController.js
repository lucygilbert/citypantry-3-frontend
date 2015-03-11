angular.module('cp.controllers.general').controller('NewsletterController', function($http,
        API_BASE, $window, LoadingService, NotificationService) {
    function subscribe() {
        LoadingService.show();

        $http.post(API_BASE + '/newsletter/subscribe', {email: vm.email})
            .then(function(response) {
                vm.success = true;
                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    }

    var vm = this;
    vm.subscribe = subscribe;
});
