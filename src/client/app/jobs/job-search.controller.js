(function() {
    'use strict';

    angular
        .module('itw.jobs')
        .controller('JobSearchController', Controller);

    Controller.$inject = ['api2', 'response', '$state', '$scope', 'searchBar'];
    /* @ngInject */
    function Controller(api2, response, $state, $scope, searchBar) {
        var vm = this,
            limitstart = response.items.length || 0;

        vm.loadItems = loadItems;
        activate();

        function activate() {
            vm.q = $state.params.q;

            vm.pagination = response.pagination;
            vm.items = _.map(response.items, function(row) {
                var rating = [],
                    i;
                for (i = 0; i < row.Relevance; i++) {
                    rating.push(i);
                }
                return _.assign(row, {
                    rating: rating
                })
            });
            vm.complete = vm.items.length >= vm.pagination.total ? 1 : 0;
            $scope.$on('$ionicView.beforeEnter', function() {
                searchBar.show({
                    stateName: 'app.jobs.search',
                    filterText: vm.q
                });
            });
        }

        function loadItems() {
            api2('jobs/search?q=' + encodeURIComponent(vm.q) + '&limitstart=' + limitstart)
                .then(function(response) {
                    vm.pagination = response.pagination;
                    vm.items = vm.items.concat(response.items);

                    $scope.$broadcast('scroll.infiniteScrollComplete');

                    limitstart += response.items.length;
                    vm.complete = limitstart >= vm.pagination.total ? 1 : 0;
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