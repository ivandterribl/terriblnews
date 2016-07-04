(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('api2', API);

    API.$inject = ['$http', 'config', '_', '$q', '$auth', '$state'];

    function API($http, config, _, $q, $auth, $state) {
        var queue = [];

        return function api2(url, options) {
            var opts = _.assign({
                    method: 'GET',
                    url: 'https://secure.itweb.co.za/api/' + url,
                    timeout: config.timeout,
                    withCredentials: true
                }, options),
                def = $q.defer();

            $http(opts)
                .success(function(response) {
                    def.resolve(response);
                })
                .error(function(response) {
                    response = response || {};
                    switch (response.error) {
                        case 'invalid_token':
                        case 'expired_token':
                            // try the refresh_token
                            var opts2 = angular.extend({}, opts, {
                                'method': 'POST',
                                'url': 'https://secure.itweb.co.za/api/accounts/login',
                                'data': {
                                    'grant_type': 'refresh_token',
                                    'client_id': 'itweb/app'
                                }
                            });
                            // clear prev token
                            $auth.removeToken();

                            $http(opts2)
                                .success(function(response) {
                                    if (response.access_token) {
                                        // we good
                                        $auth.setToken(response.access_token);
                                        // retry request
                                        $http(opts)
                                            .success(function(response) {
                                                def.resolve(response);
                                            })
                                            .error(function(response) {
                                                def.reject(response);
                                            });
                                    } else {
                                        def.reject(response);
                                    }
                                })
                                .error(function(response) {
                                    def.reject(response);
                                });
                            break;
                        default:
                            def.reject(response);
                    }
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