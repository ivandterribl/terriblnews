(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('ArticleController', Controller);

    Controller.$inject = ['$state', '$sce'];
    /* @ngInject */
    function Controller($state, $sce) {
        var vm = this;

        console.log($state.params);

        activate();

        function activate() {
            vm.article = $state.params.article;
            vm.article.html = $sce.trustAsHtml(vm.article.content);
        }
    }
})();
