angular.module('cp.factories').factory('UsersFactory', function(ApiService, API_BASE) {
    return {
        getAllUsers: () => ApiService.get(`${API_BASE}/users`),

        masqueradeAsUser: id => ApiService.post(`${API_BASE}/user/masquerade`, id),

        getLoggedInUser: () => ApiService.get(`${API_BASE}/users/get-authenticated-user`),

        registerVendor: registerDetails => ApiService.post(`${API_BASE}/user/register-vendor`, registerDetails)
    };
});
