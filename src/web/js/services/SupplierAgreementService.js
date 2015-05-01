angular.module('cp.services').service('SupplierAgreementService',
        function(VendorsFactory, NotificationService) {
    return {
        vendorHasAcceptedSupplierAgreement: (vendor) => {
            return VendorsFactory.getLatestSupplierAgreement()
                .then(response => response.data.isAccepted)
                .catch(response => NotificationService.notifyError(response.data.errorTranslation));
        }
    };
});
