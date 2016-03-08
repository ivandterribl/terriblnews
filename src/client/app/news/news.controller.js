(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('NewsController', Controller);

    Controller.$inject = ['nav', 'articles', 'categories', 'api', '_', 'meta', 'moment', '$scope', '$state', 'searchBar'];
    /* @ngInject */
    function Controller(nav, articles, categories, api, _, meta, moment, $scope, $state, searchBar) {
        var vm = this,
            id = $state.params.id,
            limitstart = $state.params.limitstart || 0,
            limit = $state.params.limit || 25;

        vm.i = 0;
        vm.prev = prev;
        vm.next = next;
        vm.showSearchbar = showSearchbar;
        vm.openMenu = openMenu;
        vm.loadItems = loadItems;
        vm.go = function($event, stateName, stateParams) {
            $event.preventDefault();
            $state.go(stateName, stateParams);
        };

        activate();

        function activate() {
            var match = {
                    items: []
                },
                category;

            _.each(nav.get(), function(group) {
                var items = _.get(group, 'items', []),
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
            api('tag=' + id + '&limitstart=' + limitstart + '&limit=' + limit, {
                    new: 1
                })
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
                .catch(function(response) {
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

        function showSearchbar() {
            searchBar.show();
        }

        function seo() {
            var desc = [
                'A vital resource for South African ICT decision-makers, ',
                'ITWeb delivers news, views and information through diverse content platforms, ',
                'including online, e-newsletters, social media, print and events. ',
                'ITWeb is recognised as South Africa\'s technology news and information leader.'
            ];
            if (vm.category) {
                meta.title('ITWeb | ' + vm.category.title);
                meta.keywords('IT, Technology, Business, News, ' + vm.category.title);
            } else {
                meta.title('ITWeb');
                meta.keywords('IT, Technology, Business, News');
            }
            meta.description(desc.join(''));

            meta.canonical(false);
            meta.ld(false);
        }
    }
})();