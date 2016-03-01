(function() {
    'use strict';

    angular
        .module('app.search')
        .controller('SearchController', Controller);

    Controller.$inject = ['api', '_', '$state', 'searchBar', 'searchBarConfig', '$ionicConfig', '$ionicHistory'];
    /* @ngInject */
    function Controller(api, _, $state, searchBar, searchBarConfig, $ionicConfig, $ionicHistory) {
        var vm = this,
            limitstart = $state.params.limitstart || 0,
            limit = $state.params.limit || 25;

        searchBar.show();

        vm.q = $state.params.q;
        activate();

        function activate() {
            loadItems();
        }

        function loadItems() {
            vm.loading = 1;
            api('tag=search&q=' + vm.q + '&limitstart=' + limitstart + '&limit=' + limit)
                .then(function(response) {
                    vm.items = response;
                })
                .catch(function(response) {
                    vm.items = [];
                })
                .finally(function() {
                    vm.loading = 0;
                });
        }
    }
})();