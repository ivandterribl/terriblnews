(function() {
    'use strict';

    angular
        .module('app.news')
        .config(Config);

    Config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function Config($stateProvider, $urlRouterProvider) {
        var resolveArticle = ['api', 'meta', '$q', '$stateParams', function(api, meta, $q, $stateParams) {
                var articleId = $stateParams.id;

                return api('/article/' + articleId)
                    .then(function(response) {
                        var article = response;

                        meta.title(article.title);
                        meta.description(article.blurb);
                        meta.keywords(article.metakey);
                        meta.canonical('http://www.itweb.co.za/index.php?' + [
                            'option=com_content',
                            'view=article',
                            'id=' + articleId
                        ].join('&'));

                        return response;
                    });
            }],
            resolveCategory = ['api', 'meta', '$q', '$stateParams', function(api, meta, $q, $stateParams) {
                var catId = $stateParams.id;

                return api('/category/' + catId)
                    .then(function(response) {
                        var article = response;

                        meta.title(response.title);

                        return response;
                    });
            }],
            resolveLocation = ['api', 'meta', '$q', '$stateParams', function(api, meta, $q, $stateParams) {
                return api('/location/' + $stateParams.id)
                    .then(function(response) {
                        var article = response;

                        meta.title(response.title);

                        return response;
                    });
            }];

        $stateProvider
            .state('app.frontpage', {
                url: '/',
                templateUrl: 'app/news/frontpage/frontpage.html',
                controller: 'FrontpageController as vm',
                resolve: {
                    seo: ['meta', function(meta) {
                        return meta.set();
                    }],
                    featured: ['$window', 'api', function($window, api) {
                        return api('/featured?width=' + $window.innerWidth);
                    }]
                }
            })
            .state('app.article', {
                url: '/content/*id',
                templateUrl: 'app/news/article/article.html',
                controller: 'ArticleController as vm',
                resolve: {
                    response: resolveArticle
                }
            })
            .state('app.category', {
                url: '/category/*id',
                templateUrl: 'app/news/articles/articles.html',
                controller: 'ArticlesController as vm',
                resolve: {
                    response: resolveCategory
                }
            })
            .state('app.location', {
                url: '/location/*id',
                templateUrl: 'app/news/articles/articles.html',
                controller: 'ArticlesController as vm',
                resolve: {
                    response: resolveLocation
                }
            });

        $urlRouterProvider.otherwise('/');
    }
})();