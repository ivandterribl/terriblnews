(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('NewsController', Controller);

    Controller.$inject = ['nav', 'articles', 'api', '_', 'meta', 'Analytics', '$scope', '$state', '$location'];
    /* @ngInject */
    function Controller(nav, articles, api, _, meta, Analytics, $scope, $state, $location) {

        var vm = this,
            id = $state.params.id,
            limitstart = $state.params.limitstart || 0,
            limit = $state.params.limit || 25;

        vm.i = 0;
        vm.prev = prev;
        vm.next = next;
        vm.openMenu = openMenu;
        vm.loadItems = loadItems;
        activate();

        function activate() {
            vm.analyticsEvent = $location.url();
            var match = {
                    items: []
                },
                category;

            _.each(nav.get(), function(group) {
                var items = group.items || [],
                    cat = _.findWhere(items, {
                        id: id
                    });

                if (cat) {
                    category = cat;
                    match = group;
                    return;
                }
            });

            vm.categories = match.items;
            if (!category) {
                vm.category = category = _.findWhere(nav.get(), {
                    id: id
                });
            } else {
                vm.category = category;
            }

            switch (id) {
                case 'industry-news':
                    vm.portalIcon = 1;
                    break;
                case 'company-news':
                    vm.companyIcon = 1;
                    break;
            }

            vm.complete = 1;
            vm.loading = 1;
            vm.items = [];
            articles.set(vm.items);
            loadItems();

            // cached view
            $scope.$on('$ionicView.enter', function() {
                $scope.$emit('category', vm.category, vm.categories);
                seo();
            });
        }

        function loadItems() {
            if (vm.items.length) {
                Analytics.trackEvent('section', 'scroll', vm.analyticsEvent, limitstart);
            }

            api('tag=' + id + '&limitstart=' + limitstart + '&limit=' + limit)
                .then(function(response) {
                    var items = [];
                    switch (id) {
                        case 'top-news':
                        case 'industry-news':
                        case 'world':
                            items = _.reject(response, function(row) {
                                return !row.section;
                            });
                            items = _.map(items, function(row) {
                                return row;
                            });
                            break;
                        default:
                            items = response;
                    }

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

        function openMenu($mdOpenMenu, ev) {
            $mdOpenMenu(ev);
        }

        function seo() {
            meta.set({
                title: vm.category ? vm.category.title : null,
                keywords: vm.category ? vm.category.title + ', IT, Technology, Business, News' : null
            });
        }
    }
})();