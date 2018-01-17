(function() {
    'use strict';

    angular
        .module('itw.user')
        .controller('SignupController', Controller);

    Controller.$inject = ['$scope', '$state', 'ui', '$auth'];
    /* @ngInject */
    function Controller($scope, $state, ui, $auth) {
        var vm = this;

        vm.signup = signup;

        activate();

        function activate() {

        }

        function signup(form) {
            if (form.$invalid) {
                form.$setSubmitted(true);
                angular.forEach(['displayName', 'email', 'password', 'confirmPassword'], function(fieldName) {
                    var input = form[fieldName];
                    if (input.$invalid) {
                        input.$setDirty(true);
                    }
                });
                return;
            }
            var payload = {
                client_id: 'itweb/app',
                displayName: vm.user.displayName,
                username: vm.user.email,
                password: vm.user.password,
                redirect_uri: 'http://v2.itweb.co.za/mobilesite/user/activate'
            };
            ui.loading.show();
            $auth.signup(payload)
                .then(function(response) {
                    $auth.setToken(response);
                    ui.show('app.user.profile');
                    ui.toast.show('info', 'You have successfully created a new account and have been signed-in');
                })
                .catch(function(response) {
                    ui.toast.show('error', response.data.error_description);
                })
                .finally(function() {
                    ui.loading.hide();
                });
        }
    }
})();