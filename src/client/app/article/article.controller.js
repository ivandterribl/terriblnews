(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('ArticleController', Controller);

    Controller.$inject = ['api', 'meta', 'moment', '_', '$state', '$sce', '$compile', '$scope', '$ionicScrollDelegate'];
    /* @ngInject */
    function Controller(api, meta, moment, _, $state, $sce, $compile, $scope, $ionicScrollDelegate) {
        var vm = this,
            articleId = $state.params.id;

        console.log($state.params);
        vm.articleId = articleId;
        vm.canonical = 'http://www.itweb.co.za/index.php?' + [
            'option=com_content',
            'view=article',
            'id=' + articleId
        ].join('&');
        meta.canonical(vm.canonical);

        vm.onDisqus = function() {
            $ionicScrollDelegate.resize();
        };

        activate();

        function activate() {
            window.prerenderReady = false;
            vm.loading = 1;

            api('tag=articlen&id=' + articleId)
                .then(onReady)
                .catch(function(response) {
                    vm.article = {
                        title: 'Oops, something went wrong'
                    };
                })
                .finally(function() {
                    vm.loading = 0;
                    //$scope.$broadcast('scroll.refreshComplete');
                });
        }

        function onReady(response) {
            var embedded = '<div adsrv what="triggeronedefault" width="120" height="250" class="adsrv-embedded"></div>',
                article = _.assign(response[0], {
                    created: moment(response[0].created).format(),
                    meta: jparam(response[0].meta)
                }),
                fulltext = article.fulltext.replace('<embedded />', embedded); //embedded);

            var $el = angular.element('<div />').html(fulltext);
            // table horizontal scroll
            $el.find('table').wrap('<ion-scroll direction="x" scroll-outside="true" scrollbar-x="true"></ion-scroll>');
            vm.article = _.assign(article, {
                html: $el.html()
            });
            var related = [];
            if (_.isString(article.related) && article.related.length) {
                _.each(article.related.split('\n'), function(row) {
                    // <format>id:slug;title\nid:slug;title</format>
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
            var topics = [];
            if (related.length && _.isString(article.metakey) && article.metakey.length) {
                topics = _.map(article.metakey.split(', '), function(row) {
                    return _.trim(row);
                });
                topics = _.slice(topics, 0, 4 - related.length);
            }
            vm.topics = topics;

            meta.description(vm.article.blurb);
            meta.keywords(vm.article.metakey);
            meta.canonical('http://www.itweb.co.za/index.php?' + [
                'option=com_content',
                'view=article',
                'id=' + articleId
            ].join('&'));

            setTimeout(function() {
                window.prerenderReady = true;
            }, 100);

            if (related.length && topics.length) {
                api('tag=recommended&id=' + articleId + '&q=' + topics[0])
                    .then(function(response) {
                        vm.recommended = response;
                    });
            }

            api('tag=appearance&id=' + articleId)
                .then(function(response) {
                    vm.appearance = response;
                });

            // vm.disqus = {
            //     shortname: 'itweb-za',
            //     id: '8f3edde904_id' + articleId,
            //     url: 'http://www.itweb.co.za/index.php?option=com_content&view=article&id=' + $state.params.id
            // };
        }

        function jparam(params) {
            var result = {};
            if (_.isString(params) && params.length) {
                _.each(params.split('\n'), function(param) {
                    var parts = param.split('='),
                        k = parts[0];

                    result[k] = _.trim(parts[1]);
                });
            }
            return result;
        }
    }
})();