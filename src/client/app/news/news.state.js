(function() {
    'use strict';

    angular
        .module('app.news')
        .config(Config);

    Config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function Config($stateProvider, $urlRouterProvider) {
        var resolveArticle = ['api', 'meta', '$q', '$stateParams', function(api, meta, $q, $stateParams) {
                var articleId = $stateParams.id;

                return $q.all({
                    article: api('tag=article&id=' + articleId),
                    appearance: api('tag=appearance&id=' + articleId)
                }).then(function(response) {
                    var article = response.article[0];

                    meta.title(article.title);
                    meta.description(article.blurb);
                    meta.keywords(article.metakey);
                    meta.ld(false);
                    meta.canonical('http://www.itweb.co.za/index.php?' + [
                        'option=com_content',
                        'view=article',
                        'id=' + articleId
                    ].join('&'));

                    return response;
                });
            }],
            resolveNav = ['nav', 'meta', '_', '$stateParams', function(nav, meta, _, $stateParams) {
                var group = _.find(nav.get(), function(group) {
                        return _.findWhere(group.items || [], {
                            id: $stateParams.id
                        });
                    }),
                    item = _.findWhere(group.items || [], {
                        id: $stateParams.id
                    });

                meta.set({
                    title: item ? item.title : void 0,
                    keywords: item ? item.title + ', IT, Technology, Business, News' : void 0
                });
                return item;
            }],
            resolveSection = ['api', 'articles', 'meta', '_', '$stateParams', function(api, articles, meta, _, $stateParams) {
                var catId = $stateParams.id,
                    endpoint;

                switch (catId) {
                    case 'columnists':
                    case 'tech-forum':
                    case 'industry-insight':
                        endpoint = 'tag=' + catId;
                        break;
                    default:
                        endpoint = 'tag=section&id=' + catId;
                }

                return api(endpoint + '&limitstart=0&limit=25')
                    .then(function(response) {
                        var section = response.length ? response[0].section : void 0,
                            items;

                        if (!section) {
                            return false;
                        }

                        var category = {
                            title: section.title,
                            id: section.id || section.catid,
                            normalized: section.title.toLowerCase().replace(/[\s,]/g, '')
                        };

                        meta.set({
                            title: category.title,
                            description: 'Latest ' + category.title + ' headlines on ITWeb'
                        });

                        return _.map(response, function(row) {
                            return _.assign(row, {
                                hideSection: 1,
                                copyPath: row.copyPath === 'n' || row.copyPath === 'itweb' ? null : row.copyPath
                            });
                        });
                    });
            }];

        $stateProvider
            .state('app.frontpage', {
                url: '/news',
                templateUrl: 'app/news/frontpage/frontpage.html',
                controller: 'FrontpageController as vm',
                resolve: {
                    seo: ['meta', function(meta) {
                        return meta.set({
                            canonical: 'http://www.itweb.co.za'
                        });
                    }]
                }
            })
            .state('app.frontpage-fix', {
                url: '/news/',
                templateUrl: 'app/news/frontpage/frontpage.html',
                controller: 'FrontpageController as vm',
                resolve: {
                    seo: ['meta', function(meta) {
                        return meta.set({
                            canonical: 'http://www.itweb.co.za'
                        });
                    }]
                }
            })
            // app.article matches news/123/123 && news/123/
            // but not news/123 hence the below
            .state('app.article-raw', {
                url: '/news/{id:int}',
                params: {
                    catid: null
                },
                templateUrl: 'app/news/article/article.html',
                controller: 'ArticleController as vm',
                resolve: {
                    response: resolveArticle
                }
            })
            .state('app.article', {
                url: '/news/{id:int}/:catid',
                params: {
                    id: null,
                    catid: {
                        value: null,
                        squash: true
                    }
                },
                templateUrl: 'app/news/article/article.html',
                controller: 'ArticleController as vm',
                resolve: {
                    response: resolveArticle
                }
            })
            .state('app.sections', {
                params: {
                    id: 'portals',
                    limit: 255
                },
                url: '/news/sections',
                templateUrl: 'app/news/section/sections.html',
                controller: 'NewsController as vm',
                resolve: {
                    activeNav: ['meta', function(meta) {
                        meta.set({
                            title: 'Industry sectors'
                        });
                        return {
                            title: 'Industry sectors'
                        };
                    }],
                    response: ['api', '$stateParams', function(api, $stateParams) {
                        return api('tag=' + $stateParams.id + '&limitstart=0&limit=255');
                    }]

                }
            })
            .state('app.section', {
                params: {
                    id: null,
                    limitstart: 25
                },
                url: '/news/sections/:id',
                templateUrl: 'app/news/section/section.html',
                controller: 'SectionController as vm',
                resolve: {
                    response: resolveSection
                }
            })
            .state('app.news', {
                url: '/news/feeds',
                abstract: true,
                params: {
                    nav: 'News'
                },
                templateUrl: 'app/core/tabs/tabs.html',
                controller: 'TabsController as vm'
            })
            .state('app.news.category', {
                params: {
                    id: null,
                    subheader: 1,
                    limitstart: 25
                },
                url: '/:id',
                views: {
                    tabContent: {
                        templateUrl: function($stateParams) {
                            return $stateParams.id === 'africa' ? 'app/news/news.ext.html' : 'app/news/news.html';
                        },
                        controller: 'NewsController as vm'
                    }
                },
                resolve: {
                    activeNav: resolveNav,
                    response: ['api', '$stateParams', function(api, $stateParams) {
                        return api('tag=' + $stateParams.id + '&limitstart=0&limit=25');
                    }]
                }
            })
            .state('app.opinion', {
                url: '/news/opinion',
                abstract: true,
                params: {
                    nav: 'Opinion'
                },
                templateUrl: 'app/core/tabs/tabs.html',
                controller: 'TabsController as vm'
            })
            .state('app.opinion.category', {
                params: {
                    id: null,
                    subheader: 1
                },
                url: '/:id',
                views: {
                    tabContent: {
                        templateUrl: 'app/news/section/section.html',
                        controller: 'SectionController as vm'
                    }
                },
                resolve: {
                    response: resolveSection
                }
            });

        $urlRouterProvider.otherwise('/news');
    }
})();