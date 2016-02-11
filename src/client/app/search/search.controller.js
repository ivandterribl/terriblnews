(function() {
    'use strict';

    angular
        .module('app.search')
        .controller('SearchController', Controller);

    Controller.$inject = ['api', '_', '$state', 'searchBar', 'searchBarConfig', '$ionicConfig', '$ionicHistory'];
    /* @ngInject */
    function Controller(api, _, $state, searchBar, searchBarConfig, $ionicConfig, $ionicHistory) {
        var vm = this;

        searchBar.show({
            items: [],
            update: angular.noop,
            done: function(text) {
                if (text && text.length) {
                    $ionicHistory.nextViewOptions({
                        disableAnimate: true
                    });

                    $state.go('app.search', {
                        q: text
                    });
                }
            }
        });

        vm.q = $state.params.q;
        activate();

        function activate() {
            loadItems();
        }

        function loadItems() {
            vm.loading = 1;
            api('tag=search&q=' + vm.q)
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