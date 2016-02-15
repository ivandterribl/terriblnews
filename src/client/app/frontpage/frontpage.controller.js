(function() {
    'use strict';

    angular
        .module('app.frontpage')
        .controller('FrontpageController', Controller);

    Controller.$inject = [
        'categories', 'articles', 'api', '_', 'meta', 'moment',
        '$scope', '$state', 'searchBar', '$ionicHistory'
    ];
    /* @ngInject */
    function Controller(categories, articles, api, _, meta, moment, $scope, $state, searchBar, $ionicHistory) {
        var vm = this,
            id = $state.params.id;

        $ionicHistory.clearHistory();
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

            vm.categories = categories.get();
            vm.category = _.findWhere(vm.categories, {
                id: id
            }) || vm.categories[0];

            vm.loading = 1;
            vm.items = [];
            loadLead();

            // cached view
            $scope.$on('$ionicView.enter', function() {
                $scope.$emit('category', vm.category);
            });
        }

        function loadLead() {
            api('tag=lead-picture')
                .then(function(response) {
                    vm.lead = response[0];
                    vm.loading = 0;
                })
                .finally(loadItems);

            api('tag=imod&q=quoteoftheday')
                .then(function(response) {
                    vm.quote = response[0];
                });

            api('tag=imod&q=picoftheday')
                .then(function(response) {
                    vm.pic = response[0];
                });

        }

        function loadItems() {
            api('tag=frontpage')
                .then(function(response) {
                    var items = _.map(response, function(row) {

                            var slug = row.section.split(':');
                            return _.assign(row, {
                                importance: parseInt(row.importance),
                                section: {
                                    id: slug[0],
                                    title: slug[1]
                                }
                            });
                        }),
                        groups = {
                            lead: _.filter(items, function(row) {
                                return row.importance === 1;
                            }),
                            top: _.filter(items, function(row) {
                                return row.importance > 1 && row.importance <= 20;
                            }),
                            industry: _.filter(items, function(row) {
                                return row.importance > 20 && row.importance <= 30;
                            }),
                            reuters: _.filter(items, function(row) {
                                return row.importance > 110 && row.importance <= 150;
                            }),
                            company: _.filter(items, function(row) {
                                return row.importance >= 200;
                            }),
                            columnists: _.filter(items, function(row) {
                                return row.importance >= 50 && row.importance < 60;
                            }),
                            insights: _.filter(items, function(row) {
                                return row.importance >= 60 && row.importance < 70;
                            }),
                            features: _.filter(items, function(row) {
                                return row.importance >= 70 && row.importance < 80;
                            }),
                            international: _.filter(items, function(row) {
                                return row.importance >= 150 && row.importance < 200;
                            })
                        },
                        minDate = _.pluck(groups.top, 'created').sort().shift(),
                        startOfDay = moment(minDate).startOf('day').format();

                    vm.items = items;

                    groups.columnists = _.reject(groups.columnists, function(row) {
                        return row.created < startOfDay;
                    });
                    groups.insights = _.reject(groups.insights, function(row) {
                        return row.created < startOfDay;
                    });
                    groups.features = _.reject(groups.features, function(row) {
                        return row.created < startOfDay;
                    });
                    groups.company = _.reject(groups.company, function(row) {
                        return row.created < startOfDay;
                    });
                    groups.international = _.reject(groups.international, function(row) {
                        return row.created < startOfDay;
                    });
                    vm.groups = groups;
                    var displayed = [];
                    _.each(vm.groups, function(group) {
                        displayed = displayed.concat(group);
                    });
                    articles.set(displayed);
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

        function showSearchbar() {
            searchBar.show({
                items: [],
                update: function(filteredItems) {
                    console.log(filteredItems);
                }
            });
        }

        function openMenu($mdOpenMenu, ev) {
            $mdOpenMenu(ev);
        }
    }
})();