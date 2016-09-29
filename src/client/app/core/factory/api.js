(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('api', API);

    API.$inject = ['$http', '_', '$q'];

    function API($http, _, $q) {
        var queue = [];

        return function(url, params) {
            var prefetched = window.prefetched,
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
                if (cache.response && cache.url.indexOf(url) !== -1) {
                    def.resolve(cache.response);
                    cache.response = null;
                    resolved = 1;
                }
            });

            if (!resolved) {
                $http({
                    method: 'GET',
                    url: 'http://www.itwebafrica.com/api' + url,
                    //url: 'http://localhost:8888/api' + url,
                    timeout: 20000,
                    params: params
                }).success(function(response) {
                    def.resolve(response);
                }).error(function(response) {
                    def.reject(response);
                });
            }

            return def.promise;
        };
    }
})();