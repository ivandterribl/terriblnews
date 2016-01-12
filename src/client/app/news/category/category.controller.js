(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('CategoryController', Controller);

    Controller.$inject = ['categories', '_', '$scope', '$state', '$ionicHistory', '$ionicFilterBar', '$timeout'];
    /* @ngInject */
    function Controller(categories, _, $scope, $state, $ionicHistory, $ionicFilterBar, $timeout) {
        var vm = this,
            categoryId = $state.params.categoryId;

        vm.i = 0;
        vm.prev = prev;
        vm.next = next;
        vm.showSearchbar = showSearchbar;
        vm.openMenu = openMenu;
        vm.loadItems = loadItems;

        vm.toggleGroup = function(group) {
            if (vm.isGroupShown(group)) {
                vm.shownGroup = null;
            } else {
                vm.shownGroup = group;
            }
        };
        vm.isGroupShown = function(group) {
            return vm.shownGroup === group;
        };

        activate();

        function activate() {
            vm.groups = [];
            vm.categories = categories.get();
            vm.category = _.findWhere(vm.categories, {
                id: categoryId
            }) || vm.categories[0];

            loadItems();

            // cached view
            $scope.$on('$ionicView.enter', function() {
                $scope.$emit('category', vm.category);
            });
        }

        function loadItems(delay) {
            $timeout(function() {
                for (var i = 0; i < 10; i++) {
                    vm.groups[vm.i] = {
                        name: vm.i,
                        items: []
                    };
                    for (var j = 0; j < 3; j++) {
                        vm.groups[vm.i].items.push(vm.i + '-' + j);
                    }
                    vm.i++;
                }

                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, delay || 0);

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