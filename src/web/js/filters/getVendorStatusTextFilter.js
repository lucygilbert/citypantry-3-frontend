angular.module('cp.filters').filter('getVendorStatusText', function() {
    return function(status) {
        status = status.split('-');
        var active = status[0];
        var approved = status[1];
        
        if (active === 'false' && approved === 'false') {
            return 'In progress';
        } else if (active === 'true' && approved === 'false') {
            return 'Awaiting approval';
        } else if (active === 'false' && approved === 'true') {
            return 'Inactive';
        } else {
            return 'Active';
        }
    };
});
