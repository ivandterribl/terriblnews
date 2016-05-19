(function() {
    'use strict';

    angular
        .module('itw.user')
        .controller('LoginController', Controller);

    Controller.$inject = ['$scope', '$state', '$ionicHistory'];
    /* @ngInject */
    function Controller($scope, $state, $ionicHistory) {
        var vm = this;

        vm.login = function(form) {
            console.log(form);
        };

        activate();

        function activate() {
            console.log('oauth2 :)');
            $ionicHistory.nextViewOptions({
                disableAnimate: true
            });

            $scope.$on('$ionicView.enter', function() {
                $scope.$emit('category', $state.params.active);
            });
        }
    }
})();