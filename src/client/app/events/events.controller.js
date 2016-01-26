(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('EventsController', Controller);

    Controller.$inject = ['nav', 'categories', 'api', '_', 'meta', 'moment', '$scope', '$state', '$sce'];
    /* @ngInject */
    function Controller(nav, categories, api, _, meta, moment, $scope, $state, $sce) {
        var vm = this,
            id = $state.params.id;

        vm.i = 0;

        vm.loadItems = loadItems;

        activate();

        function activate() {
            vm.loading = 1;
            vm.items = [];
            loadItems();
        }

        function loadItems() {
            api('tag=' + id)
                .then(function(response) {
                    if (!angular.equals(vm.items, response)) {
                        vm.items = _.map(response, function(item) {
                            item.summary = _.trim(item.summary);
                            item.src = $sce.trustAsResourceUrl('http://www.itweb.co.za/media/jukebox/' + item.mp3);
                            return item;
                        });
                        vm.groups = _.groupBy(vm.items, 'title');
                        //debugger;
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
    }
})();