(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('user', User);

    User.$inject = ['api2', '$auth', '$q'];

    function User(api2, $auth, $q) {
        var user = {
            login: login,
            get: get
        };

        return user;

        function login(credentials, params) {
            credentials = {
                username: 'ivan@itweb.co.za',
                password: 'abc123'
            };
            var deferred = $q.defer(),
                payload = angular.extend({
                    grant_type: 'password',
                    client_id: 'itweb/app'
                }, credentials);

            $auth
                .login(payload)
                .then(function() {
                    get()
                        .then(function(profile) {
                            if (profile.careerweb && profile.careerweb.identifier) {
                                api2('jobs/cv/' + profile.careerweb.identifier)
                                    .then(function(response) {
                                        angular.extend(profile.careerweb, response);
                                    })
                                    .finally(function(response) {
                                        deferred.resolve(profile);
                                    });
                            } else {
                                deferred.resolve(profile);
                            }
                        })
                        .catch(function(response) {
                            deferred.reject(response);
                        });
                });
        }

        function get() {
            var deferred = $q.defer();
            api2('v2/me')
                .then(parseProfile)
                .catch(function(response) {
                    deferred.reject(response);
                });
            return deferred.promise;

            function parseProfile(response) {
                var response = response || {},
                    picture = _.find(response.profile, {
                        key: 'photoURL'
                    });

                if (response.profile && response.profile.length) {
                    var profile = new Object();
                    _.each(_.groupBy(response.profile, 'origin'), function(items, origin) {
                        var key = origin.toLowerCase();
                        profile[key] = {};
                        _.each(items, function(item) {
                            profile[key][item.key] = item.value;
                        });
                    });

                    if (profile.itweb) {
                        response.activated = _.find(response.profile, {
                            key: 'emailVerified',
                            value: response.username
                        });
                    } else {
                        response.activated = 1;
                    }

                    user.profile = profile;

                    deferred.resolve(profile);
                }
            }
        }
    }
})();