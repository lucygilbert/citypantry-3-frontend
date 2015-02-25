angular.module('cp.filters').filter('firstName', function() {
    return fullName => String(fullName).split(' ')[0];
});
