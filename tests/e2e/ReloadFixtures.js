var exec = require('sync-exec');

module.exports = function() {
    var result = exec('bin/load-db-fixtures');
};
