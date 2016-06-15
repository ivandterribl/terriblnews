(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('api2', API);

    API.$inject = ['$http', 'config', '_', '$q', '$auth', '$state'];

    function API($http, config, _, $q, $auth, $state) {
        var queue = [];

        return function(url, options) {
            var opts = _.assign({}, options),
                def = $q.defer();

            $http({
                method: 'GET',
                url: 'https://secure.itweb.co.za/api/' + url,
                timeout: opts.timeout || config.timeout
            }, {}, {
                withCredentials: true
            }).success(function(response) {
                def.resolve(response);
            }).error(function(response) {
                switch (response.error) {
                    case 'invalid_token':
                    case 'expired_token':
                        $auth.removeToken();
                        $state.go('app.user.login');
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