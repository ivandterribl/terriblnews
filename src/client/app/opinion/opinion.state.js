(function() {
    'use strict';

    angular
        .module('app.opinion')
        .config(Config);

    Config.$inject = ['$stateProvider'];

    function Config($stateProvider) {
        $stateProvider
            .state('app.opinion', {
                url: '/opinion',
                abstract: true,
                templateUrl: 'app/opinion/opinion-tabs.html',
                controller: 'OpinionTabsController as vm'
            })
            .state('app.opinion.category', {
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