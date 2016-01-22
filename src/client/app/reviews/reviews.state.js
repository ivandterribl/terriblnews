(function() {
    'use strict';

    angular
        .module('app.reviews')
        .config(Config);

    Config.$inject = ['$stateProvider'];

    function Config($stateProvider) {
        $stateProvider
            .state('app.reviews', {
                params: {
                    id: 'reviews'
                },
                url: '/reviews',
                templateUrl: 'app/news/news.html',
                controller: 'NewsController as vm'
            });
    }
})();