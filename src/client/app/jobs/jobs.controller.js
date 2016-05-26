(function() {
    'use strict';

    angular
        .module('itw.jobs')
        .controller('JobsController', Controller);

    Controller.$inject = ['api2', 'activeNav', '$scope', '$state', '$location'];
    /* @ngInject */
    function Controller(api2, activeNav, $scope, $state, $location) {

        var vm = this,
            id = $state.params.id,
            limitstart = $state.params.limitstart || 0,
            limit = $state.params.limit || 25;

        activate();

        function activate() {
            vm.analyticsEvent = $location.url();

            vm.category = activeNav;
            vm.hasSubheader = $state.params.subheader;

            fetchItems();

            // cached view
            $scope.$on('$ionicView.enter', function() {
                $scope.$emit('category', activeNav.item);
            });
        }

        function fetchItems() {
            api2('jobs/' + activeNav.id)
                .then(function(response) {
                    vm.items = response;
                });
        }
    }
})();