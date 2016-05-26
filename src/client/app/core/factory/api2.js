(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('api2', API);

    API.$inject = ['$http', 'config', '_', '$q'];

    function API($http, config, _, $q) {
        var queue = [];

        return function(url, options) {
            var opts = _.assign({}, options),
                def = $q.defer();

            $http({
                method: 'GET',
                url: 'https://secure.itweb.co.za/api/' + url,
                timeout: opts.timeout || config.timeout
            }).success(function(response) {
                def.resolve(response);
            }).error(function(response) {
                def.reject(response);
            }).finally(function() {
                queue = _.reject(queue, function(d) {
                    return d === def;
                });
            });
            queue.push(def);

            return def.promise;
        };
    }
})();