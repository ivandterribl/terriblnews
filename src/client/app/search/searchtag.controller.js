(function() {
    'use strict';

    angular
        .module('app.search')
        .controller('SearchTagController', Controller);

    Controller.$inject = ['api', '_', '$state'];
    /* @ngInject */
    function Controller(api, _, $state) {
        var vm = this;

        vm.q = $state.params.q;
        activate();

        function activate() {
            loadItems();
        }

        function loadItems() {
            vm.loading = 1;
            api('tag=searchtag&q=' + vm.q)
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