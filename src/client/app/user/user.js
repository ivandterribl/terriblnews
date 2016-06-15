(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('user', User);

    User.$inject = ['api2', '$auth', '$q'];

    function User(api2, $auth, $q) {
        var user = {
            $auth: $auth,
            isAuthenticated: isAuthenticated,
            login: login,
            loginWith: loginWith,
            get: getProfile,
            career: {
                applications: applications
            }
        };

        return user;

        function isAuthenticated() {
            return user.$auth.isAuthenticated();
        }

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
                }

                if (response.profile.length) {
                    var profile = user.profile = new Object(),
                        image = _.find(response.profile, {
                            key: 'photoURL'
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
                            key: 'emailVerified',
                            value: response.username
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
                        api2('jobs/cv/' + profile.careerweb.identifier)
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
                                    cv.Affirmative = cv.AffirmativeActionCode[0];
                                    cv.Disabled = cv.AffirmativeActionCode.indexOf('D') !== -1 ? true : false;
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
                                angular.extend(profile.careerweb, cv);
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