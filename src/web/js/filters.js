angular.module('cp.filters', []);

angular.module('cp.filters').filter('badDateToISO8601', function() {
    return function(badTime) {
        var goodTime = badTime.replace(/(.+) (.+)/, "$1T$2Z");
        return goodTime;
    };
});
