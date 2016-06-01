(function() {
    'use strict';

    angular
        .module('itw.user')
        .controller('LoginController', Controller);

    Controller.$inject = ['$scope', '$state', '$auth', 'user', 'toastr'];
    /* @ngInject */
    function Controller($scope, $state, $auth, user, toastr) {
        var vm = this;

        vm.login = login;
        vm.authenticate = authenticate;

        activate();

        function activate() {
            vm.user = {};
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
            var payload = angular.extend({}, {
                grant_type: 'password',
                client_id: 'itweb/app',
                username: vm.user.email,
                password: vm.user.password
            });

            $auth.login(payload)
                .then(function() {
                    var redirect = $state.params.redirect || {};

                    switch (redirect.name) {
                        case 'app.jobs.job123':
                            toastr.info('');
                            $state.go(redirect.name, redirect.params);
                            break;
                        default:
                            $state.go('app.user.profile');
                    }
                })
                .catch(function(error) {
                    toastr.error(error.data.error_description, error.status);
                });
        }

        function authenticate(provider) {
            $auth.authenticate(provider)
                .then(function() {
                    $state.go('app.user.profile');
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