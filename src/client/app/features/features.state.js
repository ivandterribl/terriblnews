(function() {
    'use strict';

    angular
        .module('app.features')
        .config(Config);

    Config.$inject = ['$stateProvider'];

    function Config($stateProvider) {
        $stateProvider
            .state('app.features', {
                params: {
                    id: 'features'
                },
                url: '/features',
                templateUrl: 'app/news/news.html',
                controller: 'NewsController as vm'
            });
    }
})();