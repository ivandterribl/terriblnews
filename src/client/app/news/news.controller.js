(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('NewsController', Controller);

    Controller.$inject = ['nav', 'articles', 'categories', 'api', '_', 'meta', 'moment', '$scope', '$state', 'searchBar'];
    /* @ngInject */
    function Controller(nav, articles, categories, api, _, meta, moment, $scope, $state, searchBar) {
        var vm = this,
            id = $state.params.id;

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

            vm.loading = 1;
            vm.items = [];
            loadItems();

            // cached view
            $scope.$on('$ionicView.enter', function() {
                $scope.$emit('category', vm.category, vm.categories);
                seo();
            });
        }

        function loadItems() {
            api('tag=' + id)
                .then(function(response) {
                    switch (id) {
                        case 'top-news':
                        case 'industry-news':
                        case 'world':
                            vm.items = _.map(response, function(row) {
                                var slug = row.section.split(':');
                                return _.assign(row, {
                                    section: {
                                        id: slug[0],
                                        title: slug[1]
                                    }
                                });
                            });
                            break;
                        default:
                            vm.items = response;
                    }

                    articles.set(vm.items);
                })
                .catch(function(response) {
                    vm.items = [];
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