(function() {
    'use strict';

    angular
        .module('itw.user')
        .controller('LoginController', Controller);

    Controller.$inject = ['$scope', '$state', 'user', 'ui', '$ionicHistory', '$timeout'];
    /* @ngInject */
    function Controller($scope, $state, user, ui, $ionicHistory, $timeout) {
        var vm = this;

        vm.login = login;
        vm.authenticate = authenticate;

        activate();

        function activate() {
            vm.user = {};
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

            ui.loading.show();
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
                    ui.show(redirect.name, redirect.params);
                })
                .catch(function(error) {
                    ui.toast.show('error', error.data.error_description, error.status);
                })
                .finally(function() {
                    ui.loading.hide();
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
                    ui.show(redirect.name, redirect.params);
                })
                .catch(function(error) {
                    if (error.error) {
                        // Popup error - invalid redirect_uri, pressed cancel button, etc.
                        ui.toast.show('error', error.error);
                    } else if (error.data) {
                        // HTTP response error from server
                        ui.toast.show('error', error.data.error_description, error.status);
                    } else {
                        ui.toast.show('error', error);
                    }
                });

        }
    }
})();