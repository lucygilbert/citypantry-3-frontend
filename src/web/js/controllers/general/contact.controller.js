angular.module('cp.controllers.general', []);

angular.module('cp.controllers.general').controller('ContactController', function($http, API_BASE,
        $cookies, $window) {
    var emailModal = $window.document.querySelector('#contact-modal');
    var thanksModal = $window.document.querySelector('#thanks-modal');

    function hideModal() {
        emailModal.style.display = 'none';
    }

    function showModal() {
        emailModal.style.display = 'block';
    }

    function showThanks() {
        thanksModal.style.display = 'block';
    }

    function submit() {
        var emailDetails = {
            name: vm.name,
            email: vm.email,
            message: vm.message
        };

        $http.post(`${API_BASE}/contact/send-email`, emailDetails)
            .then(response => {
                hideModal();
                showThanks();
            })
            .catch(response => console.log('error', response));
    }

    var vm = this;
    vm.hideModal = hideModal;
    vm.showModal = showModal;
    vm.showThanks = showThanks;
    vm.submit = submit;
});
