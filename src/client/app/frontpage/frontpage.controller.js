(function() {
    'use strict';

    angular
        .module('app.frontpage')
        .controller('FrontpageController', Controller);

    Controller.$inject = ['categories', 'api', '_', 'meta', 'moment', '$scope', '$state', 'searchBar', '$ionicHistory'];
    /* @ngInject */
    function Controller(categories, api, _, meta, moment, $scope, $state, searchBar, $ionicHistory) {
        var vm = this,
            id = $state.params.id;

        $ionicHistory.clearHistory();
        vm.i = 0;
        vm.prev = prev;
        vm.next = next;
        vm.showSearchbar = showSearchbar;
        vm.openMenu = openMenu;
        vm.loadItems = loadItems;

        activate();

        function activate() {

            vm.categories = categories.get();
            vm.category = _.findWhere(vm.categories, {
                id: id
            }) || vm.categories[0];

            vm.loading = 1;
            vm.items = [];
            loadItems();

            // cached view
            $scope.$on('$ionicView.enter', function() {
                $scope.$emit('category', vm.category);
            });
        }

        function loadItems() {
            api('tag=frontpage')
                .then(function(response) {
                    var items = _.map(response, function(row) {
                            return _.assign(row, {
                                importance: parseInt(row.importance)
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
                            }).slice(0, 4),
                            insights: _.filter(items, function(row) {
                                return row.importance >= 60 && row.importance < 70;
                            }).slice(0, 4),
                            features: _.filter(items, function(row) {
                                return row.importance >= 70 && row.importance < 80;
                            }),
                            international: _.filter(items, function(row) {
                                return row.importance >= 150 && row.importance < 200;
                            })
                        };

                    vm.items = items;
                    vm.lead = _.sortBy(groups.lead, 'created').pop();
                    vm.groups = groups;
                    _.each(vm.items, function(row) {
                        console.log(row.importance + "\t" + row.title);
                    });
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