(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('SectionController', Controller);

    Controller.$inject = ['nav', 'articles', 'categories', 'api', '_', 'meta', 'moment', '$scope', '$state'];
    /* @ngInject */
    function Controller(nav, articles, categories, api, _, meta, moment, $scope, $state, searchBar) {
        var vm = this,
            id = $state.params.id;

        vm.portalIcon = 1;
        vm.loadItems = loadItems;
        vm.go = function($event, stateName, stateParams) {
            $event.preventDefault();
            $state.go(stateName, stateParams);
        };

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
                    articles.set(vm.items);
                    console.log(vm.items);
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