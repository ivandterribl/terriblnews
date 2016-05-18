(function() {
    'use strict';

    angular
        .module('itw.user')
        .controller('LoginController', Controller);

    Controller.$inject = ['$scope'];
    /* @ngInject */
    function Controller($scope) {
        var vm = this;

        vm.signup = function(signupForm) {
            console.log(signupForm);
            console.log(signupForm.email);
            console.log(signupForm.email.$error);
        }
        activate();

        function activate() {
            console.log('oauth2 :)');

            vm.user = {
                displayName: 'a'
            };

            $scope.$on('$ionicView.enter', function() {
                $scope.$emit('category', {
                    title: 'Sign up',
                    id: 'signup',
                    state: {
                        name: 'app.user.signup'
                    }
                });
            });
        }
    }
})();