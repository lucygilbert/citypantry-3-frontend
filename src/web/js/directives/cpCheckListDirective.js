angular.module('cp.controllers.general').directive('cpCheckList', function() {
    return {
        restrict: 'A',
        scope: {
            list: '=cpCheckList',
            value: '='
        },
        link: function(scope, element, attrs) {
            var handler = function(setup) {
                var checked = element.prop('checked');
                var index = scope.list.indexOf(scope.value);

                if (checked && index === -1) {
                    if (setup) {
                        element.prop('checked', false);
                    } else {
                        scope.list.push(scope.value);
                    }
                } else if (!checked && index !== -1) {
                    if (setup) {
                        element.prop('checked', true);
                    } else {
                        scope.list.splice(index, 1);
                    }
                }
            };

            var setupHandler = handler.bind(null, true);
            var changeHandler = handler.bind(null, false);

            element.on('change', () => {
                scope.$apply(changeHandler);
            });
            scope.$watch('list', setupHandler, true);
        }
    };
});
