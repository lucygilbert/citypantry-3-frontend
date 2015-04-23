var newPromise = function() {
    var thenCallback;
    var successCallback;
    var catchCallback;

    return {
        then: function(callback) {
            thenCallback = callback;
            return this;
        },
        success: function(callback) {
            successCallback = callback;
            return this;
        },
        catch: function(callback) {
            catchCallback = callback;
            return this;
        },
        resolveThen: function(args) {
            thenCallback(args);
        },
        resolveSuccess: function(args) {
            successCallback(args);
        },
        resolveCatch: function(args) {
            catchCallback(args);
        },
    };
};
