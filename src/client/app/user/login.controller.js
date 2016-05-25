(function() {
    'use strict';

    angular
        .module('itw.user')
        .controller('LoginController', Controller);

    Controller.$inject = ['$scope', '$state', '$auth', 'toastr'];
    /* @ngInject */
    function Controller($scope, $state, $auth, toastr) {
        var vm = this;

        vm.login = function() {
            var payload = angular.extend({}, {
                grant_type: 'password',
                client_id: 'itweb/app',
                username: vm.user.email,
                password: vm.user.password
            });

            $auth.login(payload)
                .then(function() {
                    $state.go('app.user.profile');
                })
                .catch(function(error) {
                    toastr.error(error.data.error_description, error.status);
                });
        };
        vm.authenticate = function(provider) {
            $auth.authenticate(provider)
                .then(function() {
                    //toastr.success('You have successfully signed in with ' + provider);
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

        };

        activate();

        function activate() {
            vm.user = {};
            $scope.$on('$ionicView.enter', function() {
                $scope.$emit('category', $state.params.active);
            });
        }
    }
})();