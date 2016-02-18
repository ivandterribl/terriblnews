(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('SectionController', Controller);

    Controller.$inject = ['nav', 'articles', 'categories', 'api', '_', 'meta', 'moment', '$scope', '$state'];
    /* @ngInject */
    function Controller(nav, articles, categories, api, _, meta, moment, $scope, $state, searchBar) {
        var vm = this,
            catId = $state.params.id;

        vm.loadItems = loadItems;

        activate();

        function activate() {
            vm.categories = [];

            vm.loading = 1;
            vm.items = [];
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

            api(endpoint)
                .then(function(response) {
                    var section = response[0].section || '';
                    vm.category = {
                        title: section,
                        id: response[0].catid,
                        normalized: section.toLowerCase().replace(/\s/g, '')
                    };
                    vm.items = _.map(response, function(row) {
                        var slug = row.section.split(':');
                        return _.assign(row, {
                            copyPath: row.copyPath === 'n' || row.copyPath === 'itweb' ? null : row.copyPath,
                            section: {
                                id: row.catid,
                                title: row.section
                            }
                        });
                    });
                    articles.set(vm.items);

                    seo();
                })
                .catch(function(response) {
                    vm.items = [];
                })
                .finally(function() {
                    vm.loading = 0;
                });

            // api('tag=sponsor&q=sponsor&id=' + catId);
            // api('tag=sponsor&q=co-sponsor&id=' + catId);
        }

        function seo() {
            meta.title(vm.category.title);
            meta.keywords(vm.category.title);
            meta.canonical(false);
            meta.ld(false);
        }

    }
})();