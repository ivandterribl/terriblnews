(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('AfricaController', Controller);

    Controller.$inject = ['nav', 'api', '_', '$scope', '$state'];
    /* @ngInject */
    function Controller(nav, api, _, $scope, $state) {
        var vm = this,
            id = $state.params.id;

        vm.i = 0;
        vm.prev = prev;
        vm.next = next;
        vm.loadItems = loadItems;

        activate();

        function activate() {
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
                vm.category = _.findWhere(nav.get(), {
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
                    if (!angular.equals(vm.items, response)) {
                        vm.items = response;
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
    }
})();
