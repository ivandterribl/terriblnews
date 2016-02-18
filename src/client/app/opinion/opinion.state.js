(function() {
    'use strict';

    angular
        .module('app.opinion')
        .config(Config);

    Config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function Config($stateProvider, $urlRouterProvider) {
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
                        templateUrl: 'app/news/section/section.html',
                        controller: 'SectionController as vm'
                    }
                }
            });
        $urlRouterProvider
            .when('/news/section/79', ['$state', function($state) {
                $state.go('app.opinion.category', {
                    id: 'columnists'
                });
            }]);
    }
})();