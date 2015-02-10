angular.module('cp.filters').filter('slugify', function() {
    return text => String(text).replace(/ +/g, '-').toLowerCase();
});
