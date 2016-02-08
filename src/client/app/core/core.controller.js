(function() {
    'use strict';

    angular
        .module('app.core')
        .controller('CoreController', Controller);

    Controller.$inject = ['nav', 'searchBar', '$state', '$ionicHistory'];
    /* @ngInject */
    function Controller(nav, searchBar, $state, $ionicHistory) {
        var vm = this;
        vm.nav = nav.get();

        vm.toggleGroup = toggleGroup;
        vm.isGroupShown = isGroupShown;
        vm.showSearchbar = showSearchbar;

        function toggleGroup(group) {
            if (vm.isGroupShown(group)) {
                vm.shownGroup = null;
            } else if (group.items && group.items.length) {
                vm.shownGroup = group;
            }
        }

        function isGroupShown(group) {
            return vm.shownGroup === group;
        }

        function showSearchbar() {
            searchBar.show();
        }
    }
})();