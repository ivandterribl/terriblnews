(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('NewsTabsController', Controller);

    Controller.$inject = ['nav', '_', '$scope', '$state', '$ionicHistory', '$ionicViewSwitcher'];
    /* @ngInject */
    function Controller(nav, _, $scope, $state, $ionicHistory, $ionicViewSwitcher) {
        var vm = this;

        vm.onCategory = showCategory;

        $scope.$on('category.prev', prev);
        $scope.$on('category.next', next);
        $scope.$on('category', activate);

        vm.categories = _.findWhere(nav.get(), {
            title: 'News'
        }).items;

        //activate();

        function activate() {
            vm.category = _.findWhere(vm.categories, {
                id: $state.params.id
            }) || vm.categories[0];
            vm.selectedIndex = vm.categories.indexOf(vm.category);
        }

        function prev() {
            vm.selectedIndex = !vm.selectedIndex ? vm.categories.length - 1 : vm.selectedIndex - 1;
            showCategory(vm.categories[vm.selectedIndex]);
        }

        function next() {
            vm.selectedIndex = vm.selectedIndex === vm.categories.length - 1 ? 0 : vm.selectedIndex + 1;
            showCategory(vm.categories[vm.selectedIndex]);
        }

        function showCategory(category) {
            var dir = vm.categories.indexOf(vm.category) > vm.categories.indexOf(category) ? 'back' : 'forward';
            $ionicViewSwitcher.nextDirection(dir);
            vm.category = category;

            $ionicHistory.nextViewOptions({
                disableBack: true
            });

            if (category.id === 'africa') {
                $state.transitionTo('app.news.africa');
            } else {
                $state.transitionTo('app.news.category', {
                    id: category.id
                });
            }
        }
    }
})();
