(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('ArticleController', Controller);

    Controller.$inject = [
        'api', 'stats', 'articles', '$q', 'meta', 'moment', '_',
        '$state', '$ionicViewSwitcher', 'Analytics'
    ];
    /* @ngInject */
    function Controller(api, stats, articles, $q, meta, moment, _, $state, $ionicViewSwitcher, Analytics) {
        var vm = this,
            articleId = parseInt($state.params.id),
            catId = $state.params.catid,
            primaryCat = [69, 77, 86, 107, 118, 133, 147, 198, 234, 250, 260];

        vm.articleId = articleId;
        vm.canonical = 'http://www.itweb.co.za/index.php?' + [
            'option=com_content',
            'view=article',
            'id=' + articleId
        ].join('&');
        vm.shortlink = 'http://on.itweb.co.za/' + articleId;
        vm.prev = prev;
        vm.next = next;

        activate();

        function activate() {
            meta.canonical(vm.canonical);

            vm.loading = 1;
            $q.all({
                    article: api('tag=article&id=' + articleId),
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

            vm.banners = banners(vm.section);

            elem.innerHTML = article.fulltext;
            if (_.isArray(article.xhead) && article.xhead[2] && article.xhead[2].length >= 2) {
                paragraphs = elem.querySelectorAll('h3:not(.quote-headline)');
                paragraphs[0].insertAdjacentHTML('beforebegin', vm.banners.shift());
                paragraphs[1].insertAdjacentHTML('beforebegin', vm.banners.shift());

            } else {
                paragraphs = elem.querySelectorAll('p:not(.pic-caption)');
                if (paragraphs.length > 3) {
                    paragraphs[3].insertAdjacentHTML('afterend', vm.banners.shift());
                }
                if (paragraphs.length > 8) {
                    paragraphs[7].insertAdjacentHTML('afterend', vm.banners.shift());
                }
            }

            angular.forEach(elem.querySelectorAll('.pullquoteauthor'), function(span) {
                if (_.trim(span.innerText) === '-') {
                    span.style.display = 'none';
                }
            });

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
                        var match = _.findWhere(related, {
                            id: response[0].id
                        });
                        if (!match) {
                            vm.recommended = response;
                        }
                    });
            }
            seo();

            logStats();
        }

        function logStats() {
            var data = {
                loc: '/article/' + articleId,
                ts: _.random(1000000000),
                id: articleId,
                catid: parseInt(vm.section.catid)
            };
            stats.log(data);
        }

        function banners(section) {
            return section.normalized ? [
                '<div class="item item-divider item-strech" style="padding-left: 0; padding-right: 0">' +
                '<div adsrv what="dbl' + section.normalized + '-mobi"></div></div>',
                '<div class="item item-divider item-strech" style="padding-left: 0; padding-right: 0">' +
                '<div adsrv what="tileone' + section.normalized + '-mobi"></div></div>'
            ] : [];
        }

        function seo() {
            meta.title(vm.article.title);
            meta.description(vm.article.blurb);
            meta.keywords(vm.article.metakey);
            meta.ld(false);
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

        function prev(trackEvent) {
            if (vm.pagination.prev && vm.pagination.prev.itemid) {
                if (trackEvent) {
                    Analytics.trackEvent('article', 'swipe', 'right');
                }

                $ionicViewSwitcher.nextDirection('back');
                $state.go('app.article', {
                    id: vm.pagination.prev.itemid,
                    catid: vm.pagination.prev.section ? vm.pagination.prev.section.id : vm.pagination.prev.catid
                }, {
                    replace: true
                });
            }
        }

        function next(trackEvent) {
            if (vm.pagination.next && vm.pagination.next.itemid) {
                if (trackEvent) {
                    Analytics.trackEvent('article', 'swipe', 'left');
                }

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