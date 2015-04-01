angular.module('cp.filters').filter('getPackagingTypeText', function() {
    return function(type) {
        switch (type) {
            case 'individual':
                return 'Individual';
            case 'buffet':
                return 'Buffet';
            case 'dont_mind':
                return 'Don’t mind';
            default:
                throw 'Unexpected type: ' + type;
        }
    };
});
