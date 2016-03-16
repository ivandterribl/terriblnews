(function() {
    'use strict';

    angular
        .module('app.core')
        .controller('CoreController', Controller);

    Controller.$inject = ['_', 'nav', 'searchBar', '$state', '$ionicHistory', '$location', 'Analytics'];
    /* @ngInject */
    function Controller(_, nav, searchBar, $state, $ionicHistory, $location, Analytics) {
        var vm = this;
        vm.nav = nav.get();

        vm.toggleGroup = toggleGroup;
        vm.isGroupShown = isGroupShown;
        vm.showSearchbar = showSearchbar;
        vm.eventName = eventName;
        vm.eventLabel = eventLabel;
        vm.back = back;

        function eventLabel() {
            return $location.url();
        }

        function eventName() {
            var view = $ionicHistory.currentView() || {
                    stateName: 'app.unknown'
                },
                group = view.stateName.split('.')[1],
                result;

            switch (group) {
                case 'frontpage':
                    result = 'frontpage';
                    break;
                case 'article':
                    result = 'article';
                    break;
                case 'office':
                    result = 'companies';
                    break;
                case 'events':
                case 'event':
                    result = 'events';
                    break;
                case 'videos':
                case 'video':
                    result = 'video';
                    break;
                case 'about':
                    result = 'about';
                    break;
                default:
                    result = 'section';
            }
            return result;
        }

        function back() {
            var view,
                params,
                stack = _.sortBy(_.toArray($ionicHistory.viewHistory().views), 'index').reverse();

            Analytics.trackEvent(eventName(), 'back', eventLabel());
            if ($ionicHistory.currentView() && $ionicHistory.currentView().stateName === 'app.article') {
                view = _.find(stack, function(needle) {
                    return needle.stateName !== 'app.article';
                });

                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $ionicHistory.clearHistory();
                $state.go(view ? view.stateName : 'app.frontpage', view ? view.stateParams : void 0);

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
            Analytics.trackEvent(eventName(), 'search', eventLabel());
            searchBar.show();
        }
    }
})();