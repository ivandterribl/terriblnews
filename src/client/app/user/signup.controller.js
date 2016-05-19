(function() {
    'use strict';

    angular
        .module('itw.user')
        .controller('SignupController', Controller);

    Controller.$inject = ['$scope', '$state'];
    /* @ngInject */
    function Controller($scope, $state) {
        var vm = this;

        vm.signup = function(form) {
            console.log(form);
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