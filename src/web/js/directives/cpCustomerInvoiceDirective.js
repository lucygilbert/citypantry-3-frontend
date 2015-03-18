angular.module('cp').directive('cpCustomerInvoice', function(OrdersFactory) {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            OrdersFactory.getCustomerInvoiceAsHtml(attrs.cpInvoiceId)
                .then(response => {
                    element.html(response.data);
                });
        }
    };
});
