var _ = require("lodash");
var Promise = require("bluebird");

module.exports = {
    assertEvent: function(contract, filter) {
        return new Promise((resolve, reject) => {
            var filteredEvent = contract[filter.event];
            if (filteredEvent) {
                var event = filteredEvent();
                event.watch();
                event.get((error, logs) => {
                    var log = _.filter(logs, filter);
                    if (log.length > 0) {
                        resolve(log);
                    } else {
                        throw Error("Failed to find filtered event for " + JSON.stringify(filter));
                    }
                });
                event.stopWatching();
            } else {
                throw Error("Failed to find filtered event for " + filter.event);
            }
        });
    },

    log: function(obj) {
        var str = JSON.stringify(obj, null, 4);
        console.log(str);
    }
}
