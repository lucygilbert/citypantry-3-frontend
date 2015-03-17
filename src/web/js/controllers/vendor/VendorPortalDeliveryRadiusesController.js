angular.module('cp.controllers.general').controller('VendorPortalDeliveryRadiusesController',
        function ($scope, $q, AddressFactory, PackagesFactory, LoadingService, DocumentTitleService,
        NotificationService, SecurityService) {
    DocumentTitleService('Your package\'s delivery radiuses');
    SecurityService.requireVendor();

    const promise1 = AddressFactory.getAddresses()
        .success(response => $scope.addresses = response.addresses)
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));

    const promise2 = PackagesFactory.getPackagesByCurrentVendor()
        .success(response => {
            $scope.packages = response.packages;
            $scope.packages.sort((a, b) => a.name.localeCompare(b.name));
        })
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));

    $q.all([promise1, promise2]).then(() => {
        $scope.packages.forEach(p => {
            $scope.addresses.forEach(address => {
                if (p.deliveryRadiuses[address.id] === undefined) {
                    p.deliveryRadiuses[address.id] = '';
                }
            });
        });
        LoadingService.hide();
    });

    $scope.save = function() {
        LoadingService.show();

        const savePromises = [];

        $scope.packages.forEach(p => {
            // Filter down to just the addresses with a radius set, removing any addresses without
            // a radius.
            const deliveryRadiuses = {};
            for (let addressId in p.deliveryRadiuses) {
                const radius = p.deliveryRadiuses[addressId];
                if (Number(radius) > 0) {
                    deliveryRadiuses[addressId] = radius;
                }
            }

            const savePromise = PackagesFactory.updatePackage(p.id, {deliveryRadiuses: deliveryRadiuses});
            savePromise.catch(response => NotificationService.notifyError(response.data.errorTranslation));
            savePromises.push(savePromise);
        });

        $q.all(savePromises).then(() => {
            NotificationService.notifySuccess('Your delivery radiuses have been saved.');
            LoadingService.hide();
        });
    };
});
