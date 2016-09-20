(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('ArticlesController', Controller);

    Controller.$inject = [
        'response', 'api', '$state',
        '$scope', '$ionicHistory', 'Analytics'
    ];
    /* @ngInject */
    function Controller(response, api, $state, $scope, $ionicHistory, Analytics) {
        var vm = this;

        $ionicHistory.clearHistory();

        vm.refresh = refresh;
        vm.next = next;

        activate();

        function activate() {
            vm.complete = 0;
            vm.categories = [];

            vm.title = response.title;
            vm.items = response.items;
        }

        function refresh() {
            next(0);
        }

        function next(limitstart) {
            var endpoint;
            limitstart = limitstart === 0 ? limitstart : vm.items.length;
            switch ($state.current.name) {
                case 'app.location':
                    endpoint = '/location/' + $state.params.id;
                    break;
                default:
                    endpoint = '/category/' + $state.params.id;
                    break;
            }
            vm.complete = 1;
            api(endpoint + '?limitstart=' + limitstart)
                .then(function(response) {
                    var items = response.items;

                    vm.complete = items.length ? 0 : 1;
                    vm.items = limitstart === 0 ? items : vm.items.concat(items);
                })
                .catch(function() {
                    vm.complete = 1;
                })
                .finally(function() {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }
    }
})();