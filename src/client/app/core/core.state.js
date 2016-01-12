(function() {
    'use strict';

    angular
        .module('app.core')
        .config(Config);

    Config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function Config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'app/core/core.html',
                controller: 'CoreController as vm'
            })
            .state('app.404', {
                url: '/404',
                templateUrl: 'app/core/404.html'
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/news/frontpage');
    }
})();