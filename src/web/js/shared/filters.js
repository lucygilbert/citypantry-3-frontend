(function() {
    angular
        .module('cp')
        .filter('filters', filters);
    
    function filters() {
        return {
            badDateToISO8601: badDateToISO8601
        };
    
        function badDateToISO8601(badTime) {
            var goodTime = badTime.replace(/(.+) (.+)/, "$1T$2Z");
            return goodTime;
        }
    }
})();
