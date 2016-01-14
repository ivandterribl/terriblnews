(function() {
    'use strict';

    angular
        .module('app.news')
        .config(Config);

    Config.$inject = ['$stateProvider'];

    function Config($stateProvider) {
        $stateProvider
            .state('app.news', {
                url: '/news',
                abstract: true,
                templateUrl: 'app/news/news.html',
                controller: 'NewsController as vm'
            })
            .state('app.news.frontpage', {
                url: '/frontpage',
                views: {
                    tabContent: {
                        templateUrl: 'app/news/frontpage/frontpage.html',
                        controller: 'FrontpageController as vm'
                    }
                }
            })
            .state('app.news.category', {
                params: {
                    categoryId: null
                },
                url: '/category/:categoryId',
                views: {
                    tabContent: {
                        templateUrl: 'app/news/category/category.html',
                        controller: 'CategoryController as vm'
                    }
                }
            })
            .state('app.article', {
                url: '/article/:id',
                templateUrl: 'app/news/article/article.html',
                controller: 'ArticleController as vm'

            });
    }
})();