(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('CategoryController', Controller);

    Controller.$inject = ['categories', 'api', '_', 'moment', '$scope', '$state', '$ionicFilterBar'];
    /* @ngInject */
    function Controller(categories, api, _, moment, $scope, $state, $ionicFilterBar) {
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
            vm.groups = [];
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
            api('tag=' + categoryId)
                .then(function(response) {
                    if (!angular.equals(vm.items, response)) {
                        vm.items = _.map(response, function(row) {
                            return _.assign(row, {
                                time: moment().subtract(_.random(24 * 60), 'minute').format()
                            });
                        });
                    }
                })
                .catch(function(response) {
                    vm.items = [];
                })
                .finally(function() {
                    vm.loading = 0;
                    $scope.$broadcast('scroll.refreshComplete');
                });
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
