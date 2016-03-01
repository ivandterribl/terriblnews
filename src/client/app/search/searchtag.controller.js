(function() {
    'use strict';

    angular
        .module('app.search')
        .controller('SearchTagController', Controller);

    Controller.$inject = ['api', '_', '$state'];
    /* @ngInject */
    function Controller(api, _, $state) {
        var vm = this,
            limitstart = $state.params.limitstart || 0,
            limit = $state.params.limit || 25;

        vm.q = $state.params.q;
        activate();

        function activate() {
            loadItems();
        }

        function loadItems() {
            vm.loading = 1;
            api('tag=searchtag&q=' + vm.q + '&limitstart=' + limitstart + '&limit=' + limit)
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