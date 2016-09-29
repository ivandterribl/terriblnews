(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('ArticleController', Controller);

    Controller.$inject = [
        'response', 'stats', '_', '$scope', '$state', '$ionicPopover', '$location'
    ];
    /* @ngInject */
    function Controller(response, stats, _, $scope, $state, $ionicPopover, $location) {
        var vm = this,
            articleId = $state.params.id;

        activate();

        function activate() {

            vm.loading = 0;

            onReady(response);

            vm.shortlink = 'http://www.itwebafrica.com/' + vm.article.link;

            $ionicPopover.fromTemplateUrl('app/news/article/article.share.popover.html', {
                scope: $scope
            }).then(function(popover) {
                vm.popover = popover;
            });

            $scope.$on('$ionicView.enter', function() {
                stats.log({
                    id: response.id,
                    catid: response.category ? response.category.id : response.company.id,
                    loc: $location.url()
                });
            });

            //Cleanup the popover when we're done with it!
            $scope.$on('$destroy', function() {
                vm.popover.remove();
            });
        }

        function onReady(response) {
            var article = response,
                topics = [];

            vm.isPR = (article.storytype === 'P') ? 1 : 0;

            vm.banners = [];

            vm.title = article.category ? article.category.title :
                article.company ? article.company.title : null;

            vm.catId = article.category ? article.category.id :
                article.company ? article.company.id : null;

            vm.adword = article.category ? normalize(article.category.title) : null;

            vm.article = article;

            if (_.isString(article.metakey) && article.metakey.length) {
                topics = _.map(article.metakey.split(', '), function(row) {
                    return row.trim ? row.trim() : row;
                });
                topics = _.reject(topics, function(row) {
                    return row.length > 20;
                });
            }
            vm.topics = topics;
        }

        function normalize(title) {
            return angular.isString(title) ? title.toLowerCase().replace(/[^a-z0-9]/gi, '') : null;
        }
    }
})();