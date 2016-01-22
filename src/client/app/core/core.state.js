(function() {
    'use strict';

    angular
        .module('app.core')
        .config(Config);

    Config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

    function Config($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider
            .state('app', {
                url: '',
                abstract: true,
                templateUrl: 'app/core/core.html',
                controller: 'CoreController as vm'
            })
            .state('app.article', {
                url: '/article/:id',
                templateUrl: 'app/article/article.html',
                controller: 'ArticleController as vm'

            })
            .state('app.404', {
                url: '/404',
                templateUrl: 'app/core/404.html'
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/frontpage');
        $locationProvider.html5Mode(true).hashPrefix('!');
    }
})();