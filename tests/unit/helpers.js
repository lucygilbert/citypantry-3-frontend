var newPromise = function() {
    return {
        then: function() { return this },
        success: function() { return this },
        catch: function() { return this }
    };
};
