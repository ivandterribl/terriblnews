(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('SectionController', Controller);

    Controller.$inject = ['nav', 'categories', 'api', '_', 'meta', 'moment', '$scope', '$state', 'searchBar'];
    /* @ngInject */
    function Controller(nav, categories, api, _, meta, moment, $scope, $state, searchBar) {
        var vm = this,
            id = $state.params.id;

        vm.showSearchbar = showSearchbar;
        vm.loadItems = loadItems;

        activate();

        function activate() {
            vm.categories = [];

            vm.loading = 1;
            vm.items = [];
            loadItems();

            // cached view
            $scope.$on('$ionicView.enter', function() {
                $scope.$emit('category', vm.category, vm.categories);
            });
        }

        function loadItems() {
            api('tag=section&id=' + id)
                .then(function(response) {
                    vm.items = _.map(response, function(row) {
                        if (row.copyPath === 'n' || row.copyPath === 'itweb') {
                            row.copyPath = null;
                        }
                        return row;
                    });
                    vm.category = {
                        title: vm.items[0].section,
                        id: id
                    };
                    console.log(vm.items);
                })
                .catch(function(response) {
                    vm.items = [];
                })
                .finally(function() {
                    vm.loading = 0;
                });
        }

        function showSearchbar() {
            searchBar.show({
                items: [],
                update: function(filteredItems) {
                    console.log(filteredItems);
                }
            });
        }
    }
})();