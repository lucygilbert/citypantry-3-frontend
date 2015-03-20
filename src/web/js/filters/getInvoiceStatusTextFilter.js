angular.module('cp.filters').filter('getInvoiceStatusText', function() {
    return function(status) {
        switch (status) {
            case 'awaiting_payment':
                return {
                    actionText: 'Paid',
                    statusText: 'Awaiting payment'
                };
            case 'paid':
                return {
                    actionText: 'Awaiting payment',
                    statusText: 'Paid'
                };
            default:
                throw 'Unexpected status: ' + status;
        }
    };
});
