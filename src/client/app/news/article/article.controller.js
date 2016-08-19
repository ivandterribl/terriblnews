(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('ArticleController', Controller);

    Controller.$inject = [
        'api', 'api2', 'stats', 'response', 'articles', 'moment', '_',
        '$scope', '$state', '$ionicPopover', '$ionicViewSwitcher', '$injector', 'Analytics'
    ];
    /* @ngInject */
    function Controller(api, api2, stats, response, articles, moment, _,
        $scope, $state, $ionicPopover, $ionicViewSwitcher, $injector, Analytics) {
        var vm = this,
            articleId = parseInt($state.params.id),
            catId = parseInt($state.params.catid),
            exclude = [69, 77, 86, 107, 118, 133, 147, 198, 234, 250, 260];

        vm.articleId = articleId;
        vm.canonical = 'http://www.itweb.co.za/index.php?' + [
            'option=com_content',
            'view=article',
            'id=' + articleId
        ].join('&');
        vm.shortlink = 'http://on.itweb.co.za/' + articleId;
        vm.prev = prev;
        vm.next = next;
        vm.showDisqus = showDisqus;

        activate();

        function activate() {
            vm.disqus = {
                shortname: 'itweb-za',
                id: '8f3edde904_id' + articleId,
                url: 'http://www.itweb.co.za/index.php?option=com_content&view=article&id=' + $state.params.id
            };

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
            var article = _.assign(response.article[0], {
                created: moment(response.article[0].created).format(),
                meta: jparam(response.article[0].meta)
            });

            vm.appearance = _.reject(response.appearance, function(row) {
                return exclude.indexOf(parseInt(row.catid)) !== -1;
            }).slice(0, 5);

            if (catId) {
                // ilog_lb missing catid quickfix
                if (catId === parseInt(article.catid)) {
                    vm.section = {
                        catid: article.catid,
                        title: article.category,
                        normalized: article.category.toLowerCase().replace(/\s/g, '')
                    };
                } else {
                    _.each(response.appearance, function(row) {
                        if (catId && parseInt(row.catid) === catId) {
                            vm.section = _.assign(row, {
                                normalized: row.title.toLowerCase().replace(/\s/g, '')
                            });
                        }
                    });
                }
            }

            var rand,
                categories = response.appearance;

            if (!vm.section) {
                rand = categories[0];
                vm.section = _.assign(rand, {
                    normalized: rand.title.toLowerCase().replace(/\s/g, '')
                });
            }

            vm.isPR = (article.storytype === 'P') ? 1 : 0;

            vm.banners = vm.isPR ? [] : banners(vm.section);

            vm.article = _.assign(article, {
                html: vm.isPR ? article.fulltext : parseHtml(article)
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
                    return row.trim ? row.trim() : row;
                });
                topics = _.reject(topics, function(row) {
                    return row.length > 20;
                });
                topics = topics.slice(0, 4 - related.length);
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

            var $timeout = $injector.get('$timeout');

            if (topics.length) {
                api('tag=recommended&id=' + articleId + '&q=' + topics[0])
                    .then(function(response) {
                        var match = _.findWhere(related, {
                            id: response[0].id
                        });
                        if (!match) {
                            vm.recommended = response;
                        }
                    })
                    .finally(function() {
                        $timeout(function() {
                            vm.disqus.ready = 1;
                        }, 750);
                    });
            } else {
                $timeout(function() {
                    vm.disqus.ready = 1;
                }, 750);
            }

            if (vm.appearance.length) {
                getJobs();
            }

            seo();

            logStats();
        }

        function parseHtml(article) {
            var elem = document.createElement('div'),
                paragraphs;

            elem.innerHTML = article.fulltext;

            // sidebar floating above pic layout issue
            // swap sidebar & pic
            var picElem;
            // clean up empty elements
            angular.forEach(elem.children, function(child) {
                if (!child.innerText.trim()) {
                    elem.removeChild(child);
                }
            });
            if (elem.children[0] && elem.children[1] &&
                elem.children[0].className.indexOf('sidebar') !== -1 &&
                elem.children[1].className.indexOf('pic') !== -1) {

                picElem = elem.children[1];
                elem.removeChild(picElem);
                elem.insertBefore(picElem, elem.children[0]);
            }

            if (_.isArray(article.xhead) && article.xhead[2] && article.xhead[2].length >= 2) {
                paragraphs = elem.querySelectorAll('h3:not(.quote-headline):not(.sidebar-headline)');
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
                if (span.innerText.trim() === '-') {
                    span.style.display = 'none';
                }
            });

            var $el = angular.element('<div />')
                .html(elem.innerHTML);

            $el.find('table')
                .wrap('<ion-scroll direction="x" scroll-outside="true" scrollbar-x="true"></ion-scroll>');

            return $el.html();
        }

        function logStats() {
            var data = {
                loc: $state.href($state.current.name, $state.params),
                ts: _.random(1000000000),
                id: articleId,
                catid: parseInt(vm.section.catid)
            };
            stats.log(data);
        }

        function banners(section) {
            return section.normalized ? [
                '<div class="item item-divider item-stretch">' +
                '<div adsrv what="dbl' + section.normalized + '-mobi"></div></div>',
                '<div class="item item-divider item-stretch">' +
                '<div adsrv what="tileone' + section.normalized + '-mobi"></div></div>'
            ] : [];
        }

        function seo() {
            // meta.title(vm.article.title);
            // meta.description(vm.article.blurb);
            // meta.keywords(vm.article.metakey);
            // meta.ld(false);
            // meta.canonical('http://www.itweb.co.za/index.php?' + [
            //     'option=com_content',
            //     'view=article',
            //     'id=' + articleId
            // ].join('&'));
        }

        function jparam(params) {
            var result = {};
            if (_.isString(params) && params.length) {
                _.each(params.split('\n'), function(param) {
                    var parts = param.split('='),
                        k = parts[0];

                    if (parts[1]) {
                        result[k] = parts[1].trim ? parts[1].trim() : parts[1];
                    }
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

        function showDisqus() {
            var $ionicScrollDelegate = $injector.get('$ionicScrollDelegate'),
                $ionicPosition = $injector.get('$ionicPosition'),
                elem = angular.element(document.getElementById('disqusIt')),
                y = $ionicPosition.offset(elem).top +
                $ionicScrollDelegate.getScrollPosition().top - 44;
            y = $ionicPosition.offset(elem).top - 44;
            $ionicScrollDelegate.scrollBy(0, y, true);
        }

        function getJobs() {
            api2('jobs/search?q=' + encodeURIComponent(vm.section.title) + '&limit=3&fmt=short')
                .then(function(response) {
                    vm.jobs = response;
                    //if (response.length) {
                    //    vm.jobs = response;
                    //} else if (vm.topics.length) {
                    //    api2('jobs/search?q=' + encodeURIComponent(vm.topics[0]) + '&limit=3&fmt=short')
                    //        .then(function(response) {
                    //            vm.jobs = response;
                    //        });
                    //}
                });
        }
    }
})();