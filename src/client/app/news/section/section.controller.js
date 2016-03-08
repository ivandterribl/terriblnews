(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('SectionController', Controller);

    Controller.$inject = ['nav', 'articles', 'categories', 'api', '_', 'meta', 'moment', '$scope', '$state'];
    /* @ngInject */
    function Controller(nav, articles, categories, api, _, meta, moment, $scope, $state, searchBar) {
        var vm = this,
            catId = $state.params.id,
            limitstart = 0,
            limit = 25;

        vm.loadItems = loadItems;
        vm.complete = 1;

        activate();

        function activate() {
            vm.categories = [];

            vm.loading = 1;
            vm.items = [];
            articles.set(vm.items);
            loadItems();

            // cached view
            $scope.$on('$ionicView.enter', function() {
                $scope.$emit('category', vm.category, vm.categories);
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

            api(endpoint + '&limitstart=' + limitstart + '&limit=' + limit, {
                    new: 1
                })
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

                    seo();
                    vm.complete = 0;
                })
                .catch(function(response) {
                    vm.items = [];
                    vm.complete = 1;
                })
                .finally(function() {
                    vm.loading = 0;
                });

            // api('tag=sponsor&q=sponsor&id=' + catId);
            // api('tag=sponsor&q=co-sponsor&id=' + catId);
        }

        function seo() {
            meta.title(vm.category.title);
            meta.description('View the latest ' + vm.category.title + ' headlines on ITWeb');
            meta.keywords(vm.category.title + ', IT, News');
            meta.canonical(false);
            meta.ld(false);
        }
    }
})();