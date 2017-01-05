(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('api', API);

    API.$inject = ['$http', 'config', '_', '$q'];

    function API($http, config, _, $q) {
        var queue = [];

        return function(url, options) {
            var opts = _.assign({}, options),
                prefetched = window.prefetched,
                def = $q.defer();

            def.promise.success = function(fn) {
                def.promise.then(fn, null);
                return def.promise;
            };
            def.promise.error = function(fn) {
                def.promise.then(null, fn);
                return def.promise;
            };

            var resolved = 0;
            angular.forEach(window.prefetched || [], function(cache) {
                if (cache.response.length && cache.url.indexOf(url) !== -1) {
                    def.resolve(cache.response);
                    cache.response = [];
                    resolved = 1;
                }
            });

            if (!resolved) {
                $http({
                    method: 'GET',
                    //url: config.url + url,
                    //url: 'http://www.itweb.co.za/mobilesite/feed/ivan/?' + url,
                    url: 'https://secure.itweb.co.za/api/news/?' + url,
                    timeout: opts.timeout || config.timeout,
                    withCredentials: true
                }).success(function(response) {
                    //console.log('%c' + url, 'background-color: yellow');
                    //console.log('%c' + JSON.stringify(response), 'background-color: #aFa');
                    if (response.length || (response.items && response.items.length)) {
                        def.resolve(response);
                    } else {
                        def.reject(response);
                    }
                }).error(function(response) {
                    def.reject(response);
                }).finally(function() {
                    queue = _.reject(queue, function(d) {
                        return d === def;
                    });
                });
                queue.push(def);
            }

            return def.promise;
        };
    }
})();