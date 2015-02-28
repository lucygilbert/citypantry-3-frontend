angular.module('cp.factories').factory('AuthenticationFactory', function(ApiService, API_BASE) {
    return {

        login: loginDetails => ApiService.post(`${API_BASE}/user/login`),

        register: registerDetails => ApiService.post(`${API_BASE}/user/register`),

        requestResetEmail: email => ApiService.post(`${API_BASE}/user/request-reset-email`, email),

        setPassword: resetDetails => ApiService.post(`${API_BASE}/user/set-password`, resetDetails)
    };
});
