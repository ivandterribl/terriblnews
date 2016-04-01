(function() {
    'use strict';

    angular
        .module('app.news')
        .config(Config);

    Config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function Config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app.frontpage', {
                url: '/news',
                templateUrl: 'app/news/frontpage/frontpage.html',
                controller: 'FrontpageController as vm'
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
                    response: ['api', 'meta', '$q', '$stateParams', function(api, meta, $q, $stateParams) {
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
                    }]
                }
            })
            .state('app.article', {
                url: '/news/{id:int}/{catid:int}',
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
                    response: ['api', 'meta', '$q', '$stateParams', function(api, meta, $q, $stateParams) {
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
                    }]
                }
            })
            .state('app.sections', {
                params: {
                    id: 'portals',
                    limit: 255
                },
                url: '/news/sections',
                templateUrl: 'app/news/section/sections.html',
                controller: 'NewsController as vm'
            })
            .state('app.section', {
                params: {
                    id: null
                },
                url: '/news/sections/:id',
                templateUrl: 'app/news/section/section.html',
                controller: 'SectionController as vm'
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
            .state('app.news.africa', {
                params: {
                    id: 'africa'
                },
                url: '/africa',
                views: {
                    tabContent: {
                        templateUrl: 'app/news/news.ext.html',
                        controller: 'NewsController as vm'
                    }
                }
            })
            .state('app.news.category', {
                params: {
                    id: null
                },
                url: '/:id',
                views: {
                    tabContent: {
                        templateUrl: 'app/news/news.html',
                        controller: 'NewsController as vm'
                    }
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
                    id: null
                },
                url: '/:id',
                views: {
                    tabContent: {
                        templateUrl: 'app/news/section/section.html',
                        controller: 'SectionController as vm'
                    }
                }
            });

        $urlRouterProvider.otherwise('/news');
    }
})();