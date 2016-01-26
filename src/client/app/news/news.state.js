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
                templateUrl: 'app/news/news-tabs.html',
                controller: 'NewsTabsController as vm'
            })
            .state('app.news.africa', {
                params: {
                    id: 'africa'
                },
                url: '/africa',
                views: {
                    tabContent: {
                        templateUrl: 'app/news/africa.html',
                        controller: 'AfricaController as vm'
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
            });
    }
})();