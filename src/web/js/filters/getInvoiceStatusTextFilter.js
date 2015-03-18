angular.module('cp.filters').filter('getInvoiceStatusText', function() {
    return function(status) {
        switch (status) {
            case 'awaiting_payment':
                return 'Awaiting payment';
            case 'paid':
                return 'Paid';
            default:
                throw 'Unexpected status: ' + status;
        }
    };
});
