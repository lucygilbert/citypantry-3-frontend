angular.module('cp.filters').filter('getPayOnAccountStatusText', function() {
    return function(isPayOnAccount) {
        if (isPayOnAccount === false) {
            return {
                actionText: 'Enable',
                statusText: 'No'
            };
        } else if (isPayOnAccount === true) {
            return {
                actionText: 'Disable',
                statusText: 'Yes'
            };
        } else {
            throw new Error('Unexpected: isPayOnAccount: ' + isPayOnAccount);
        }
    };
});
