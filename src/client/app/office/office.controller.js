(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('OfficeController', Controller);

    Controller.$inject = ['nav', 'categories', 'api', '_', 'meta', 'moment', '$scope', '$state', 'searchBar'];
    /* @ngInject */
    function Controller(nav, categories, api, _, meta, moment, $scope, $state, searchBar) {
        var vm = this,
            id = $state.params.id;

        vm.i = 0;
        vm.prev = prev;
        vm.next = next;
        vm.showSearchbar = showSearchbar;
        vm.loadItems = loadItems;

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

            vm.loading = 1;
            vm.items = [];
            loadItems();

            // cached view
            $scope.$on('$ionicView.enter', function() {
                $scope.$emit('category', vm.category, vm.categories);
            });
        }

        function loadItems() {
            api('tag=' + id)
                .then(function(response) {
                    var items = _.map(response, function(row) {
                        var group = row
                            .title
                            .substr(0, 1)
                            .toUpperCase();

                        return {
                            group: group.charCodeAt(0) >= 65 && group.charCodeAt(0) <= 90 ? group : '#',
                            title: row.title,
                            url: row.url,
                            image: row.image
                        };
                    });
                    if (id === 'microsites') {
                        vm.items = _.sortBy(items, 'title');
                    } else {
                        vm.groups = _.groupBy(items, 'group');
                    }

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
    }
})();