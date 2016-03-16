(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('OfficeController', Controller);

    Controller.$inject = ['nav', 'api', '_', 'meta', '$scope', '$state', '$location'];
    /* @ngInject */
    function Controller(nav, api, _, meta, $scope, $state, $location) {
        var vm = this,
            id = $state.params.id;

        vm.i = 0;
        vm.prev = prev;
        vm.next = next;
        vm.loadItems = loadItems;
        vm.eventLabel = eventLabel;

        activate();

        function eventLabel() {
            return $location.url();
        }

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
                seo();
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
                        vm.items = items;
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

        function seo() {
            var desc = [
                'A vital resource for South African ICT decision-makers, ',
                'ITWeb delivers news, views and information through diverse content platforms, ',
                'including online, e-newsletters, social media, print and events. ',
                'ITWeb is recognised as South Africa\'s technology news and information leader.'
            ];
            meta.title(vm.category.title);
            meta.description(desc.join(''));
            meta.keywords(vm.category.title + ', IT, Technology, Business, News');
            meta.canonical(false);
            meta.ld(false);
        }

    }
})();