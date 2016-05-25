(function() {
    'use strict';

    angular
        .module('itw.user')
        .controller('ProfileController', Controller);

    Controller.$inject = ['$scope', '$auth', '$state', '$http', 'toastr', '$ionicHistory', '$timeout'];
    /* @ngInject */
    function Controller($scope, $auth, $state, $http, toastr, $ionicHistory, $timeout) {
        var vm = this,
            url = 'https://secure.itweb.co.za/api/';

        vm.link = linkProfile;
        vm.unlink = unlinkProfile;
        vm.logout = logout;
        vm.edit = updateProfile;
        vm.email = emailActivationCode;

        activate();

        function activate() {
            getProfile();
        }

        function updateProfile(profileForm) {
            var payload = {
                displayName: vm.usr.displayName,
                companyName: vm.profile.itweb && vm.profile.itweb.companyName ? vm.profile.itweb.companyName : null,
                position: vm.profile.itweb && vm.profile.itweb.position ? vm.profile.itweb.position : null
            };

            return $http.post(url + 'v2/me', payload)
                .then(function() {
                    toastr.success('Profile has been updated');
                })
                .catch(function(response) {
                    toastr.error(response.data.error_description, response.status);
                });;
        }

        function emailActivationCode() {
            return $http.get(url + 'accounts/activation')
                .then(function(response) {
                    toastr.info('Verification email sent to ' + response.data.username);
                });
        }

        function fetchProfile() {
            return $http.get(url + 'v2/me');
        }

        function getProfile() {
            fetchProfile()
                .then(parseProfile)
                .catch(function(response) {
                    var data = response.data;
                    switch (data.error) {
                        case 'expired_token':

                            var data = {
                                'grant_type': 'refresh_token',
                                'client_id': 'itweb/app'
                            };
                            toastr.info('Your session has expired');
                            $http.post('https://secure.itweb.co.za/api/accounts/login', data)
                                .then(function(response) {
                                    if (response.data && response.data.access_token) {
                                        $auth.setToken(response.data.access_token);
                                        toastr.info('Session restored');
                                        getProfile();
                                    } else {
                                        logout()
                                    }
                                })
                                .catch(logout);
                            break;
                        case 'invalid_token':
                            toastr.error(response.data.error_description, response.status);
                            logout();
                            break;
                        default:
                            toastr.error(response.data.error_description, response.status);
                    }
                });

        }

        function linkProfile(provider) {
            $auth.link(provider)
                .then(function() {
                    toastr.success('You have successfully linked a ' + provider + ' account');
                    getProfile();
                })
                .catch(function(response) {
                    toastr.error(response.data.error_description, response.status);
                });
        }

        function unlinkProfile(provider) {
            $auth.unlink(provider)
                .then(function(response) {
                    toastr.info('You have unlinked a ' + provider + ' account');
                    parseProfile(response);
                })
                .catch(function(response) {
                    toastr.error(response.data ? response.data.error_description : 'Could not unlink ' + provider + ' account', response.status);
                });
        }

        function parseProfile(response) {
            var usr = response.data || {},
                picture = _.find(usr.profile, {
                    key: 'photoURL'
                });

            if (!usr.profile || !usr.profile.length) {
                toastr.info('No profile found');
                logout();
            } else {
                var profile = new Object();
                _.each(_.groupBy(usr.profile, 'origin'), function(items, origin) {
                    var key = origin.toLowerCase();
                    profile[key] = {};
                    _.each(items, function(item) {
                        profile[key][item.key] = item.value;
                    });
                });
                usr.itweb = _.where(usr.profile || [], {
                    origin: 'ITWeb'
                });
                usr.google = _.where(usr.profile || [], {
                    origin: 'Google'
                });
                usr.facebook = _.where(usr.profile || [], {
                    origin: 'Facebook'
                });
                usr.twitter = _.where(usr.profile || [], {
                    origin: 'Twitter'
                });
                if (picture) {
                    usr.picture = picture.value;
                }

                if (profile.itweb) {
                    usr.activated = _.find(usr.profile, {
                        key: 'emailVerified',
                        value: usr.username
                    });
                } else {
                    usr.activated = 1;
                }

                vm.usr = usr;
                vm.profile = profile;
            }
        }

        function logout() {
            return $auth.logout()
                .finally(function() {
                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    });
                    $state.go('app.frontpage')
                        .then(function() {
                            toastr.info('You have been logged out');
                            $timeout($ionicHistory.clearCache, 351);
                        });

                });
        }
    }
})();