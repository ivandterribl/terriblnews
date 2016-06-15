(function() {
    'use strict';

    angular
        .module('itw.user')
        .controller('LoginController', Controller);

    Controller.$inject = ['$scope', '$state', '$auth', 'user', 'toastr', '$ionicHistory', '$timeout'];
    /* @ngInject */
    function Controller($scope, $state, $auth, user, toastr, $ionicHistory, $timeout) {
        var vm = this;

        vm.login = login;
        vm.authenticate = authenticate;

        activate();

        function activate() {
            vm.user = {
                // email: 'ivan@itweb.co.za',
                // password: 'abc123'
            };
            console.log($state.params);
        }

        function login(form) {
            if (form.$invalid) {
                form.$setSubmitted(true);
                angular.forEach(['email', 'password'], function(fieldName) {
                    var input = form[fieldName];
                    if (input.$invalid) {
                        input.$setDirty(true);
                    }
                });
                return;
            }
            var payload = {
                username: vm.user.email,
                password: vm.user.password
            };

            user.login(payload)
                .then(function(profile) {
                    var redirect = $state.params.redirect;
                    if (_.isEmpty(redirect)) {
                        redirect = {
                            name: 'app.user.profile'
                        };
                    }

                    $ionicHistory.clearCache();
                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    });
                    $state.go(redirect.name, redirect.params);
                })
                .catch(function(error) {
                    toastr.error(error.data.error_description, error.status);
                });
        }

        function authenticate(provider) {
            user.loginWith(provider)
                .then(function() {
                    var redirect = $state.params.redirect;
                    if (_.isEmpty(redirect)) {
                        redirect = {
                            name: 'app.user.profile'
                        };
                    }
                    $ionicHistory.clearCache();
                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    });
                    $state.go(redirect.name, redirect.params);
                })
                .catch(function(error) {
                    if (error.error) {
                        // Popup error - invalid redirect_uri, pressed cancel button, etc.
                        toastr.error(error.error);
                    } else if (error.data) {
                        // HTTP response error from server
                        toastr.error(error.data.error_description, error.status);
                    } else {
                        toastr.error(error);
                    }
                });

        }
    }
})();