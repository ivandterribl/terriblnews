(function() {
    'use strict';

    angular
        .module('app.core')
        .controller('CoreController', Controller);

    Controller.$inject = ['_', 'nav', 'searchBar', '$state', '$ionicHistory'];
    /* @ngInject */
    function Controller(_, nav, searchBar, $state, $ionicHistory) {
        var vm = this;
        vm.nav = nav.get();

        vm.toggleGroup = toggleGroup;
        vm.isGroupShown = isGroupShown;
        vm.showSearchbar = showSearchbar;
        vm.back = function() {
            var view,
                params,
                stack = _.sortBy(_.toArray($ionicHistory.viewHistory().views), 'index').reverse();

            if ($ionicHistory.currentView() && $ionicHistory.currentView().stateName === 'app.article') {
                _.each(stack, function(history) {
                    if (history.stateName !== 'app.article') {
                        view = history.stateName;
                        params = history.stateParams;
                        return false;
                    }
                });
                // while ($ionicHistory.backView() && $ionicHistory.backView().stateName == 'app.article') {
                //     view = $ionicHistory.backView().stateName;
                // }
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $ionicHistory.clearHistory();
                $state.go(view || 'app.frontpage', params);
            } else {
                $ionicHistory.goBack();
            }
        };

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