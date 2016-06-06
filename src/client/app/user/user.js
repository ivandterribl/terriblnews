(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('user', User);

    User.$inject = ['api2', '$auth', '$q'];

    function User(api2, $auth, $q) {
        var user = {
            $auth: $auth,
            login: login,
            //loginWith: loginWith,
            get: getProfile,
            career: {
                applications: applications
            }
        };

        return user;

        function applications(CVID) {
            return api2('jobs/me/' + user.profile.careerweb.CVID)
                .then(function(response) {
                    user.profile.careerweb.applications = response;
                });
        }

        function login(credentials, params) {
            var payload = angular.extend({
                grant_type: 'password',
                client_id: 'itweb/app'
            }, credentials);

            return $auth
                .login(payload)
                .then(function() {
                    return getProfile();
                });
        }

        function getProfile() {
            var deferred = $q.defer();
            api2('v2/me')
                .then(parseProfile)
                .catch(function(response) {
                    deferred.reject(response);
                });
            return deferred.promise;

            function parseProfile(response) {
                response = response || {
                    profile: []
                }

                if (response.profile.length) {
                    var profile = user.profile = new Object();
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
                }
            }
        }
    }
})();