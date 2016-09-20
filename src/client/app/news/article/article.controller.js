(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('ArticleController', Controller);

    Controller.$inject = [
        'response', '_', '$scope', '$state', '$ionicPopover'
    ];
    /* @ngInject */
    function Controller(response, _, $scope, $state, $ionicPopover) {
        var vm = this,
            articleId = $state.params.id;

        vm.articleId = articleId;
        vm.canonical = 'http://www.itwebafrica.com/' + articleId;
        vm.shortlink = 'http://www.itwebafrica.com/' + articleId;

        activate();

        function activate() {

            vm.loading = 0;

            onReady(response);

            $ionicPopover.fromTemplateUrl('app/news/article/article.share.popover.html', {
                scope: $scope
            }).then(function(popover) {
                vm.popover = popover;
            });

            //Cleanup the popover when we're done with it!
            $scope.$on('$destroy', function() {
                vm.popover.remove();
            });
        }

        function onReady(response) {
            var article = response;

            vm.isPR = (article.storytype === 'P') ? 1 : 0;

            vm.banners = [];

            vm.article = _.assign(article, {
                html: article.text
            });

            vm.title = vm.article.category ? vm.article.category.title :
                vm.article.company ? vm.article.company.title : null;

            vm.catId = vm.article.category ? vm.article.category.id :
                vm.article.company ? vm.article.company.id : null;

            var topics = [];
            if (_.isString(article.metakey) && article.metakey.length) {
                topics = _.map(article.metakey.split(', '), function(row) {
                    return row.trim ? row.trim() : row;
                });
                topics = _.reject(topics, function(row) {
                    return row.length > 20;
                });
                //topics = topics.slice(0, 4 - article.urls.length);
            }
            vm.topics = topics;

            vm.section = 'noop';
        }

    }
})();