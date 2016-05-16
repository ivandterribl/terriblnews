(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('OfficeController', Controller);

    Controller.$inject = ['nav', 'activeNav', 'response', '_', 'meta', '$scope', '$state', '$location'];
    /* @ngInject */
    function Controller(nav, activeNav, response, _, meta, $scope, $state, $location) {
        var vm = this,
            id = $state.params.id;

        vm.prev = prev;
        vm.next = next;
        vm.eventLabel = eventLabel;

        activate();

        function eventLabel() {
            return $location.url();
        }

        function activate() {
            vm.category = activeNav;

            parseResponse(response);

            // cached view
            $scope.$on('$ionicView.enter', function() {
                $scope.$emit('category', vm.category);
            });
        }

        function parseResponse(response) {
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
            if (id === 'virtual-press-office') {
                vm.groups = _.groupBy(items, 'group');
                vm.items = items;
            } else {
                vm.items = _.sortBy(items, 'title');
            }

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