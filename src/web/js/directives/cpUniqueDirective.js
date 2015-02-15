angular.module('cp.controllers.general').directive('cpUnique', function($q, ApiService, API_BASE) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelController) {
            ngModelController.$asyncValidators.unique = function(modelValue, viewValue) {
                if (ngModelController.$isEmpty(modelValue)) {
                    return $q.when();
                }

                var deferred = $q.defer();
                var attrVal = attrs.cpUnique.split('.');
                var collection = attrVal[0];
                var field = attrVal[1];

                ApiService.get(`${API_BASE}/${collection}/is-${field}-in-use?${field}=${viewValue}`)
                    .then(unique => {
                        if (unique) {
                            deferred.resolve();
                        } else {
                            deferred.reject();
                        }
                    });

                return deferred.promise;
            };
        }
    };
});
