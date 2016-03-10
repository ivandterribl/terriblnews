(function() {
    'use strict';

    angular
        .module('app.core')
        .controller('CoreController', Controller);

    Controller.$inject = ['_', 'nav', 'searchBar', '$state', '$ionicHistory', '$location'];
    /* @ngInject */
    function Controller(_, nav, searchBar, $state, $ionicHistory, $location) {
        var vm = this;
        vm.nav = nav.get();

        vm.toggleGroup = toggleGroup;
        vm.isGroupShown = isGroupShown;
        vm.showSearchbar = showSearchbar;
        vm.eventLabel = eventLabel;
        vm.eventValue = eventValue;
        vm.back = back;

        function eventLabel() {
            var segments = _.compact($location.url().split('/')),
                parts = _.reject(segments, function(segment) {
                    return segment === 'news';
                });

            return parts.length ? parts[0] : void 0;
        }

        function eventValue() {
            var segments = _.compact($location.url().split('/')),
                parts = _.reject(segments, function(segment) {
                    return segment === 'news';
                });

            console.log(parts);
            return parts.length ? parts[1] : void 0;
        }

        function back() {
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

                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $ionicHistory.clearHistory();
                $state.go(view || 'app.frontpage', params);
            } else {
                $ionicHistory.goBack();
            }
        }

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