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
        vm.canonical = 'http://www.itweb.co.za/index.php?' + [
            'option=com_content',
            'view=article',
            'id=' + $state.params.id
        ].join('&');
        meta.canonical(vm.canonical);

        vm.onDisqus = function() {
            $ionicScrollDelegate.resize();
        };

        activate();

        function activate() {
            window.prerenderReady = false;
            vm.loading = 1;

            api('tag=article&id=' + $state.params.id)
                .then(function(response) {
                    var embedded = '<div adsrv what="triggeronedefault" width="120" height="250" class="adsrv-embedded"></div>',
                        article = _.assign(response[0], {
                            created: moment(response[0].created).format()
                        }),
                        fulltext = article.fulltext.replace('<embedded />', embedded); //embedded);

                    var $el = angular.element('<div />').html(fulltext);
                    // table horizontal scroll
                    $el.find('table').wrap('<ion-scroll direction="x" scroll-outside="true" scrollbar-x="true"></ion-scroll>');
                    vm.article = _.assign(article, {
                        html: $el.html()
                    });
                    var related = [];
                    if (_.isString(article.related)) {
                        _.each(article.related.split('\n'), function(row) {
                            var parts = row.split(';'),
                                slug = parts[0],
                                title = parts[1];

                            related.push({
                                id: parts[0].split(':')[0],
                                title: parts[1]
                            });
                        });
                    }
                    vm.related = related;

                    meta.description(vm.article.blurb);
                    meta.keywords(vm.article.metakey);
                    meta.canonical('http://www.itweb.co.za/index.php?' + [
                        'option=com_content',
                        'view=article',
                        'id=' + $state.params.id
                    ].join('&'));

                    setTimeout(function() {
                        window.prerenderReady = true;
                    }, 100);

                    // vm.disqus = {
                    //     shortname: 'itweb-za',
                    //     id: '8f3edde904_id' + $state.params.id,
                    //     url: 'http://www.itweb.co.za/index.php?option=com_content&view=article&id=' + $state.params.id
                    // };
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