(function() {
    'use strict';

    angular
        .module('itw.user')
        .controller('SignupController', Controller);

    Controller.$inject = ['$scope', '$state', '$auth', 'toastr'];
    /* @ngInject */
    function Controller($scope, $state, $auth, toastr) {
        var vm = this;

        vm.signup = function(form) {
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
                redirect_uri: 'http://localhost:3000/user/activate'
            };

            $auth.signup(payload)
                .then(function(response) {
                    $auth.setToken(response);
                    $state.go('app.user.profile');
                    toastr.info('You have successfully created a new account and have been signed-in');
                })
                .catch(function(response) {
                    toastr.error(response.data.error_description);
                });
        };

        activate();

        function activate() {
            console.log('oauth2 :)');

            $scope.$on('$ionicView.enter', function() {
                $scope.$emit('category', $state.params.active);
            });
        }
    }
})();