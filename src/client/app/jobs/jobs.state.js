(function() {
    'use strict';

    angular
        .module('app.jobs')
        .config(Config);

    Config.$inject = ['$stateProvider'];

    function Config($stateProvider) {
        $stateProvider
            .state('app.jobs', {
                params: {
                    id: 'jobs'
                },
                url: '/jobs',
                templateUrl: 'app/news/news.html',
                controller: 'NewsController as vm'
            });
    }
})();