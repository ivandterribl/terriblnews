(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('ArticleController', Controller);

    Controller.$inject = ['api', 'meta', 'moment', '_', '$state', '$sce', '$compile', '$scope', '$ionicScrollDelegate'];
    /* @ngInject */
    function Controller(api, meta, moment, _, $state, $sce, $compile, $scope, $ionicScrollDelegate) {
        var vm = this;

        console.log($state.params);
        vm.articleId = $state.params.id;

        vm.onDisqus = function() {
            $ionicScrollDelegate.resize();
        };

        activate();

        function activate() {
            vm.loading = 1;
            api('tag=article&id=' + $state.params.id)
                .then(function(response) {
                    var embedded = '<adsrv what="triggeronedefault" width="120" height="250" class="adsrv-embedded"></adsrv>',
                        article = _.assign(response[0], {
                            created: moment(response[0].created).format()
                        }),
                        fulltext = article.fulltext.replace('<embedded />', embedded); //embedded);

                    //fulltext = $compile(fulltext)($scope);
                    vm.article = _.assign(article, {
                        //html: $sce.trustAsHtml(fulltext)
                        html: fulltext
                    });

                    meta.description(vm.article.blurb);
                    meta.keywords(vm.article.metakey);
                    meta.canonical('http://www.itweb.co.za/index.php?' + [
                        'option=com_content',
                        'view=article',
                        'id=' + $state.params.id
                    ].join('&'));

                    vm.disqus = {
                        shortname: 'itweb-za',
                        id: '8f3edde904_id' + $state.params.id,
                        url: 'http://www.itweb.co.za/index.php?option=com_content&view=article&id=' + $state.params.id
                    };
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