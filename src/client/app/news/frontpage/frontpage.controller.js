(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('FrontpageController', Controller);

    Controller.$inject = ['rss', 'categories', '_', '$scope', '$state', '$ionicFilterBar'];
    /* @ngInject */
    function Controller(rss, categories, _, $scope, $state, $ionicFilterBar) {
        var vm = this,
            categoryId = $state.params.categoryId;

        vm.i = 0;
        vm.prev = prev;
        vm.next = next;
        vm.showSearchbar = showSearchbar;
        vm.openMenu = openMenu;
        vm.loadItems = loadItems;

        activate();

        function activate() {
            vm.categories = categories.get();
            vm.category = _.findWhere(vm.categories, {
                id: categoryId
            }) || vm.categories[0];

            vm.loading = 1;
            loadItems();

            // cached view
            $scope.$on('$ionicView.enter', function() {
                $scope.$emit('category', vm.category);
            });
        }

        function loadItems() {
            var url = 'http://www.itweb.co.za/index.php?option=com_rd_rss&id=1';
            setTimeout(function() {

                rss(url)
                    .then(function(response) {
                        if (!angular.equals(vm.items, response)) {
                            vm.items = response;
                        }
                    })
                    .catch(function(response) {
                        vm.items = [];
                    })
                    .finally(function() {
                        vm.loading = 0;
                        $scope.$broadcast('scroll.refreshComplete');
                    });
            }, 500);
        }

        function prev() {
            // $emit event up | $broadcast event down
            $scope.$emit('category.prev');
        }

        function next() {
            $scope.$emit('category.next');
        }

        function showSearchbar() {
            $ionicFilterBar.show({
                items: [],
                update: function(filteredItems) {
                    console.log(filteredItems);
                }
            });
        }

        function openMenu($mdOpenMenu, ev) {
            $mdOpenMenu(ev);
        }
    }
})();