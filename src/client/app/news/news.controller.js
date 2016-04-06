(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('NewsController', Controller);

    Controller.$inject = ['nav', 'articles', 'api', '_', 'activeNav', 'response', 'Analytics', '$scope', '$state', '$location'];
    /* @ngInject */
    function Controller(nav, articles, api, _, activeNav, response, Analytics, $scope, $state, $location) {

        var vm = this,
            id = $state.params.id,
            limitstart = $state.params.limitstart || 0,
            limit = $state.params.limit || 25;

        vm.prev = prev;
        vm.next = next;
        vm.loadItems = loadItems;
        activate();

        function activate() {
            vm.analyticsEvent = $location.url();

            vm.category = activeNav;
            vm.hasSubheader = $state.params.subheader;

            vm.shortcuts = {};

            switch (id) {
                case 'industry-news':
                    vm.shortcuts['sections'] = 1;
                    break;
                case 'company-news':
                    vm.shortcuts['companies'] = 1;
                    break;
            }

            vm.items = response;
            articles.set(vm.items);
            vm.complete = 0;

            // cached view
            $scope.$on('$ionicView.enter', function() {
                $scope.$emit('category', activeNav.item);
            });
        }

        function loadItems() {
            if (vm.items.length) {
                Analytics.trackEvent('section', 'scroll', vm.analyticsEvent, limitstart);
            }

            api('tag=' + id + '&limitstart=' + limitstart + '&limit=' + limit)
                .then(function(response) {
                    var items = response;

                    vm.items = vm.items.concat(items);
                    articles.push(items);

                    limitstart += limit;

                    $scope.$broadcast('scroll.infiniteScrollComplete');

                    articles.push(items);

                    vm.complete = 0;
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

        function prev() {
            // $emit event up | $broadcast event down
            $scope.$emit('category.prev');
        }

        function next() {
            $scope.$emit('category.next');
        }
    }
})();