(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('ArticleController', Controller);

    Controller.$inject = [
        'api', 'articles', '$q', 'meta', 'moment', '_',
        '$state', '$ionicScrollDelegate', '$ionicViewSwitcher', '$ionicHistory'
    ];
    /* @ngInject */
    function Controller(api, articles, $q, meta, moment, _, $state, $ionicScrollDelegate, $ionicViewSwitcher, $ionicHistory) {
        var vm = this,
            articleId = $state.params.id,
            catId = $state.params.catid,
            primaryCat = [69, 77, 86, 107, 118, 133, 147, 198, 234, 250, 260];

        console.log('catId: ' + catId);
        vm.articleId = articleId;
        vm.canonical = 'http://www.itweb.co.za/index.php?' + [
            'option=com_content',
            'view=article',
            'id=' + articleId
        ].join('&');
        vm.prev = prev;
        vm.next = next;

        activate();

        function activate() {
            meta.canonical(vm.canonical);

            window.prerenderReady = false;

            vm.loading = 1;
            $q.all({
                    article: api('tag=articlen&id=' + articleId),
                    appearance: api('tag=appearance&id=' + articleId)
                })
                .then(onReady)
                .finally(function() {
                    vm.loading = 0;
                });
        }

        function onReady(response, appearance) {
            var article,
                elem = document.createElement('div'),
                paragraphs;

            article = _.assign(response.article[0], {
                created: moment(response.article[0].created).format(),
                meta: jparam(response.article[0].meta)
            });

            vm.appearance = _.reject(response.appearance, function(row) {
                return primaryCat.indexOf(parseInt(row.catid)) !== -1;
            });

            _.each(response.appearance, function(row) {
                if (catId && row.catid === catId) {
                    vm.section = _.assign(row, {
                        normalized: row.title.toLowerCase().replace(/\s/g, '')
                    });
                }
            });

            var rand,
                categories = vm.appearance.length ? vm.appearance : response.appearance;
            if (!vm.section) {
                rand = categories[_.random(categories.length - 1)];
                vm.section = _.assign(rand, {
                    normalized: rand.title.toLowerCase().replace(/\s/g, '')
                });
            }

            vm.banners = banners(vm.section.normalized);

            elem.innerHTML = article.fulltext;
            paragraphs = elem.querySelectorAll('p:not(.pic-caption)');

            if (paragraphs.length > 3) {
                paragraphs[3].insertAdjacentHTML('afterend', vm.banners.shift());
            }
            if (paragraphs.length > 8) {
                paragraphs[7].insertAdjacentHTML('afterend', vm.banners.shift());
            }

            var $el = angular.element('<div />')
                .html(elem.innerHTML);

            $el.find('table')
                .wrap('<ion-scroll direction="x" scroll-outside="true" scrollbar-x="true"></ion-scroll>');

            vm.article = _.assign(article, {
                html: $el.html()
            });

            var related = [];
            if (_.isString(article.related) && article.related.length) {
                _.each(article.related.split('\n'), function(row) {
                    // <format>id:slug;title\nid:slug;title</format>
                    var parts = row.split(';');

                    related.push({
                        id: (parts[0] || '').split(':')[0],
                        title: parts[1]
                    });
                });
            }
            vm.related = related;

            var topics = [];
            if (_.isString(article.metakey) && article.metakey.length) {
                topics = _.map(article.metakey.split(', '), function(row) {
                    return _.trim(row);
                });
                topics = _.reject(topics, function(row) {
                    return row.length > 20;
                });
                topics = _.slice(topics, 0, 4 - related.length);
            }
            vm.topics = topics;

            vm.pagination = {
                total: articles.len(),
                index: articles.indexOf({
                    itemid: articleId
                }),
                prev: articles.prev({
                    itemid: articleId
                }),
                next: articles.next({
                    itemid: articleId
                })
            };

            if (topics.length) {
                api('tag=recommended&id=' + articleId + '&q=' + topics[0])
                    .then(function(response) {
                        vm.recommended = response;
                    });
            }
            seo();

            setTimeout(function() {
                window.prerenderReady = true;
            }, 100);
        }

        function banners(keyword) {
            var innerWidth = _.min([window.innerWidth - 20, 728]),
                estimatedHeight = vm.h = Math.floor(innerWidth / 728 * 90);

            return keyword ? [
                '<div class="item item-divider item-strech"><div adsrv what="tileone' + keyword + '"></div></div>',
                '<div adsrv what="triggeronedefault" class="embedded"></div>'
            ] : [];
        }

        function seo() {
            meta.title(vm.article.title);
            meta.description(vm.article.blurb);
            meta.keywords(vm.article.metakey);
            meta.canonical('http://www.itweb.co.za/index.php?' + [
                'option=com_content',
                'view=article',
                'id=' + articleId
            ].join('&'));
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

        function prev() {
            if (vm.pagination.prev && vm.pagination.prev.itemid) {
                $ionicViewSwitcher.nextDirection('back');
                $state.go('app.article', {
                    id: vm.pagination.prev.itemid,
                    catid: vm.pagination.prev.section ? vm.pagination.prev.section.id : vm.pagination.prev.catid
                }, {
                    replace: true
                });
            }
        }

        function next() {
            if (vm.pagination.next && vm.pagination.next.itemid) {
                $ionicViewSwitcher.nextDirection('forward');
                $state.go('app.article', {
                    id: vm.pagination.next.itemid,
                    catid: vm.pagination.next.section ? vm.pagination.next.section.id : vm.pagination.next.catid
                }, {
                    replace: true
                });
            }
        }

    }
})();