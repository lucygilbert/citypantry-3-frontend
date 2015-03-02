angular.module('cp.factories').factory('QuoteFactory', function(ApiService, API_BASE) {
    return {
        sendQuote: quoteDetails => ApiService.post(`${API_BASE}/quote/send-quote`, quoteDetails)
    };
});
