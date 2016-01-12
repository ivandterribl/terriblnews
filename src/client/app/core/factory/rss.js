(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('rss', RSS);

    RSS.$inject = ['$http', 'config', '_', '$q'];

    function RSS($http, config, _, $q) {
        return function(url, options) {
            var def = $q.defer();

            $http.jsonp('http://ajax.googleapis.com/ajax/services/feed/load?' +
                    ['v=1.0', 'num=20', 'callback=JSON_CALLBACK', 'q=' + encodeURIComponent(url)].join('&'))
                .then(function(response) {
                    var items = _.get(response, 'data.responseData.feed.entries', []);
                    if (items.length) {
                        def.resolve(items);
                    } else {
                        def.reject(response);
                    }
                })
                .catch(function(response) {
                    def.reject(response);
                });
            return def.promise;
        };
    }

    // function API($http, config, _, $q) {
    //     var queue = [];

    //     return function(url, options) {
    //         var opts = _.assign({}, options),
    //             def = $q.defer();

    //         def.promise.success = function(fn) {
    //             def.promise.then(fn, null);
    //             return def.promise;
    //         };
    //         def.promise.error = function(fn) {
    //             def.promise.then(null, fn);
    //             return def.promise;
    //         };

    //         $http({
    //             method: 'GET',
    //             url: config.url + url,
    //             timeout: opts.timeout || config.timeout
    //         }).success(function(response) {
    //             console.log('RSS > then', response);
    //         }).error(function(response) {
    //             console.log('RSS > catch', response);
    //         }).finally(function() {
    //             queue = _.reject(queue, function(d) {
    //                 return d === def;
    //             });
    //         });
    //         queue.push(def);

    //         return def.promise;
    //     };
    // }
})();