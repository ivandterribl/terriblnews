(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('ArticleController', Controller);

    Controller.$inject = ['api', 'meta', '$state', '$sce'];
    /* @ngInject */
    function Controller(api, meta, $state, $sce) {
        var vm = this;

        console.log($state.params);

        activate();

        function activate() {
            vm.loading = 1;
            api('tag=article&id=' + $state.params.id)
                .then(function(response) {
                    vm.article = response[0];
                    vm.article.html = $sce.trustAsHtml(vm.article.fulltext);

                    meta.description(vm.article.blurb);
                    meta.keywords(vm.article.metakey);
                    meta.canonical('http://www.itweb.co.za/index.php?' + [
                        'option=com_content',
                        'view=article',
                        'id=' + vm.article.id
                    ].join('&'));
                })
                .catch(function(response) {
                    vm.article = {
                        title: 'Not found'
                    };
                })
                .finally(function() {
                    vm.loading = 0;
                    //$scope.$broadcast('scroll.refreshComplete');
                });
        }
    }
})();