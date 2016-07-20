(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('EventsController', Controller);

    Controller.$inject = ['api', '$scope', '$state'];
    /* @ngInject */
    function Controller(api, $scope, $state) {
        var vm = this,
            id = $state.params.id;

        vm.loadItems = loadItems;

        activate();

        function activate() {
            vm.loading = 1;
            vm.items = [];
            loadItems();
        }

        function loadItems() {
            api('tag=events2')
                .then(function(response) {
                    vm.items = response;
                })
                .catch(function(response) {
                    vm.items = [];
                })
                .finally(function() {
                    vm.loading = 0;
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }
    }
})();