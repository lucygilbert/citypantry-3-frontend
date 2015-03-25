var exec = require('sync-exec');

module.exports = function() {
    var result = exec('bin/load-db-fixtures');
    if (result.status !== 0) {
        console.log('Failed to reload fixtures', result);
        throw new Error(result);
    }
};
