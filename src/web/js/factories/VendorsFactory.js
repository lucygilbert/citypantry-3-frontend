angular.module('cp.factories').factory('VendorsFactory', function(ApiService,
        API_BASE, $q) {
    return {
        getAllVendors: function() {
            return ApiService.get(`${API_BASE}/vendors`);
        },
        getAllActiveAndApprovedVendors: function() {
            return ApiService.get(`${API_BASE}/vendors/all-active-and-approved`);
        },
        getVendor: function(idOrSlug) {
            return ApiService.get(`${API_BASE}/vendors/${idOrSlug}`);
        },

        getAddresses: () => ApiService.get(`${API_BASE}/addresses`),

        getAddressById: (id) => {
            const deferred = $q.defer();

            ApiService.get(`${API_BASE}/addresses`).success(function(response) {
                const addresses = response.addresses;
                let address;
                for (let i = 0; i < addresses.length; i++) {
                    if (addresses[i].id === id) {
                        address = addresses[i];
                    }
                }
                deferred.resolve(address);
            }).catch(function() {
                deferred.reject();
            });

            return deferred.promise;
        },

        updateVendor: function(id, updatedVendor) {
            return ApiService.put(`${API_BASE}/vendors/${id}`, updatedVendor);
        },
        deleteVendor: function(id) {
            return ApiService.delete(`${API_BASE}/vendors/${id}`);
        },
        getBusinessTypes: () => ApiService.get(`${API_BASE}/business-types`),

        getBusinessAddresses: () => {
            // @todo – replace with ApiService.
            return [
                {
                    _id: 1,
                    label: 'Francis House',
                    addressLine1: 'Francis House',
                    addressLine2: '11 Francis Street',
                    addressLine3: 'Westminster',
                    city: 'London',
                    postcode: 'SW1P 1DE',
                    countryName: 'United Kingdom',
                    telephoneNumber: '020 3397 8376',
                    latitude: '51.496406',
                    longitude: '-0.136674',
                    deliveryRadius: 2
                },
                {
                    _id: 2,
                    label: '17a Electric Lane',
                    addressLine1: '17a Electric Lane',
                    addressLine2: 'Brixton',
                    addressLine3: '',
                    city: 'London',
                    postcode: 'SW9 8LA',
                    countryName: 'United Kingdom',
                    telephoneNumber: '020 3397 8376',
                    latitude: '51.461982',
                    longitude: '-0.113982',
                    deliveryRadius: 2
                }
            ];
        }
    };
});
