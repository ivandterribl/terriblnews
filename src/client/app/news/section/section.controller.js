(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('SectionController', Controller);

    Controller.$inject = ['articles', 'api', 'stats', '_', 'response', '$scope', '$state', '$location', 'Analytics'];
    /* @ngInject */
    function Controller(articles, api, stats, _, response, $scope, $state, $location, Analytics) {
        var vm = this,
            catId = $state.params.id,
            limitstart = $state.params.limitstart || 25,
            limit = 25;

        vm.loadItems = loadItems;
        vm.complete = 1;

        activate();

        function activate() {
            vm.analyticsEvent = $location.url();
            vm.categories = [];

            var section = response[0].section || {
                    title: ''
                },
                items;

            vm.hasSubheader = $state.params.subheader;
            vm.category = {
                title: section.title,
                id: section.id || section.catid,
                normalized: section.title.toLowerCase().replace(/\s/g, '')
            };

            items = _.map(response, function(row) {
                return _.assign(row, {
                    hideSection: 1,
                    copyPath: row.copyPath === 'n' || row.copyPath === 'itweb' ? null : row.copyPath
                });
            });
            vm.items = items;
            articles.set(items);
            vm.complete = 0;

            // cached view
            $scope.$on('$ionicView.enter', function() {
                $scope.$emit('category', vm.category);
                logStats();
            });
        }

        function loadItems() {
            var endpoint;

            switch (catId) {
                case 'columnists':
                case 'tech-forum':
                case 'industry-insight':
                    vm.hasSubheader = 1;
                    endpoint = 'tag=' + catId;
                    break;
                case 'features':
                case 'cio-zone':
                case 'reviews':
                    endpoint = 'tag=' + catId;
                    break;
                default:
                    endpoint = 'tag=section&id=' + catId;
            }

            if (vm.items.length) {
                Analytics.trackEvent('section', 'scroll', vm.analyticsEvent, limitstart);
            }

            api(endpoint + '&limitstart=' + limitstart + '&limit=' + limit)
                .then(function(response) {
                    var section = response[0].section || {
                            title: ''
                        },
                        items;

                    vm.category = {
                        title: section.title,
                        id: section.id || section.catid,
                        normalized: section.title.toLowerCase().replace(/\s/g, '')
                    };

                    items = _.map(response, function(row) {
                        return _.assign(row, {
                            hideSection: 1,
                            copyPath: row.copyPath === 'n' || row.copyPath === 'itweb' ? null : row.copyPath
                        });
                    });
                    vm.items = vm.items.concat(items);
                    articles.push(items);

                    limitstart += items.length;

                    $scope.$broadcast('scroll.infiniteScrollComplete');

                    vm.complete = 0;
                })
                .catch(function() {
                    vm.items = [];
                    vm.complete = 1;
                })
                .finally(function() {
                    vm.loading = 0;
                });
        }

        function logStats() {
            if (parseInt(catId)) {
                // opinion logged in core.run
                var data = {
                    loc: $state.href($state.current.name, $state.params),
                    ts: _.random(1000000000),
                    catid: parseInt(catId)
                };
                stats.log(data);
            }
        }
    }
})();