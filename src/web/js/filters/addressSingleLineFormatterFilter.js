angular.module('cp.filters', []);

angular.module('cp.filters').filter('addressSingleLineFormatter', function() {
    return address => address.addressLine1 +
        (address.addressLine2 ? ', ' + address.addressLine2 : '') +
        (address.addressLine3 ? ', ' + address.addressLine3 : '') +
        (address.city ? ', ' + address.city : '') +
        (address.postcode ? ', ' + address.postcode : '') +
        (address.countryName ? ', ' + address.countryName : '');
});
