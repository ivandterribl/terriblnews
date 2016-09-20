(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('FrontpageController', Controller);

    Controller.$inject = [
        'featured', 'api', '_',
        '$scope', '$window', '$ionicHistory', 'Analytics'
    ];
    /* @ngInject */
    function Controller(featured, api, _, $scope, $window, $ionicHistory, Analytics) {
        var vm = this;

        $ionicHistory.clearHistory();

        vm.refresh = refresh;
        vm.next = next;

        activate();

        function activate() {
            vm.complete = 1;
            vm.showcase = [];
            vm.items = [];

            next(0);

            vm.showcase = featured.items;
        }

        function refresh() {
            vm.complete = 1;
            api('/featured?width=' + $window.innerWidth)
                .then(function(featured) {
                    vm.showcase = featured.items;
                    vm.items = [];
                    next(0);
                })
                .catch(function() {
                    vm.items = [];
                    vm.complete = 1;
                })
                .finally(function() {
                    vm.loading = 0;
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }

        function next(limitstart) {
            limitstart = angular.isUndefined(limitstart) ? vm.showcase.length + vm.items.length : limitstart;
            if (limitstart) {
                Analytics.trackEvent('frontpage', 'scroll', vm.analyticsEvent, limitstart);
            }

            api('/articles?limitstart=' + limitstart)
                .then(function(response) {
                    var items = _.reject(response.items, function(item) {
                        return _.find(vm.showcase, function(row) {
                            return row.id === item.id;
                        });
                    });

                    vm.items = vm.items.concat(items);

                    vm.complete = vm.items.length ? 0 : 1;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                })
                .catch(function() {
                    vm.items = [];
                    vm.complete = 1;
                })
                .finally(function() {
                    vm.loading = 0;
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }
    }
})();