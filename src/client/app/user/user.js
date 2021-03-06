(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('user', User);

    User.$inject = ['api2', '$auth', '$q', '_'];

    function User(api2, $auth, $q, _) {
        var tokenWasChecked = 0,
            user = {
                $auth: $auth,
                isAuthenticated: isAuthenticated,
                checkLogin: checkLogin,
                login: login,
                loginWith: loginWith,
                get: getProfile,
                career: {
                    applications: applications
                }
            };

        return user;

        function checkLogin() {
            var deferred = $q.defer(),
                opts = {
                    method: 'POST',
                    data: {
                        'grant_type': 'refresh_token',
                        'client_id': 'itweb/app'
                    }
                };

            if (!tokenWasChecked) {
                api2('accounts/login', opts)
                    .then(function(response) {
                        $auth.setToken(response.access_token);
                        deferred.resolve(user);
                    })
                    .catch(function(response) {
                        deferred.reject();
                    })
                    .finally(function() {
                        tokenWasChecked = 1;
                    });
            } else {
                deferred.reject();
            }
            return deferred.promise;
        }

        function isAuthenticated() {
            return user.$auth.isAuthenticated();
        }

        function applications(CVID) {

            return api2('jobs/applications')
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

        function loginWith(provider) {
            return $auth.authenticate(provider)
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
                };

                if (response.profile.length) {
                    var profile = user.profile = {},
                        image = _.find(response.profile, {
                            key: 'photoURL1'
                        });
                    _.each(_.groupBy(response.profile, 'origin'), function(items, origin) {
                        var key = origin.toLowerCase();
                        profile[key] = {};
                        _.each(items, function(item) {
                            profile[key][item.key] = item.value;
                        });
                    });

                    if (profile.itweb || profile.careerweb) {
                        profile.activated = _.find(response.profile, {
                            key: 'emailVerified'
                        });
                    } else {
                        profile.activated = 1;
                    }

                    angular.extend(profile, {
                        id: response.id,
                        displayName: response.displayName,
                        username: response.username,
                        image: image ? image.value : 'http://placehold.it/100x100'
                    });

                    if (profile.careerweb && profile.careerweb.identifier) {
                        api2('jobs/cv/')
                            .then(function(cv) {
                                var matches = {
                                    firstName: _.find(response.profile, {
                                        key: 'firstName'
                                    }),
                                    lastName: _.find(response.profile, {
                                        key: 'lastName'
                                    }),
                                    email: _.find(response.profile, {
                                        key: 'email'
                                    }),
                                    gender: _.find(response.profile, {
                                        key: 'gender'
                                    })
                                };

                                if (cv && cv.AffirmativeActionCode) {
                                    cv.Gender = cv.AffirmativeActionCode.indexOf('M') === -1 ? 'F' : 'M';
                                    cv.Race = cv.AffirmativeActionCode[0];
                                    cv.PhysicallyDisabled = cv.AffirmativeActionCode.indexOf('D') !== -1 ? true : false;
                                } else {
                                    if (matches.gender) {
                                        cv.Gender = matches.gender.value === 'female' ? 'F' : 'M';
                                    }
                                    if (matches.firstName) {
                                        cv.FirstName = matches.firstName.value;
                                    }
                                    if (matches.lastName) {
                                        cv.Surname = matches.lastName.value;
                                    }
                                    cv.EmailAddress = profile.username;
                                }
                                profile.careerweb.cv = cv;
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