(function() {
    'use strict';

    angular
        .module('app.search')
        .config(Config);

    Config.$inject = ['$stateProvider'];

    function Config($stateProvider) {
        $stateProvider
            .state('app.search', {
                url: '/search?q',
                templateUrl: 'app/search/search.html',
                controller: 'SearchController as vm'
            })
            .state('app.topic', {
                url: '/topic?q',
                templateUrl: 'app/search/searchtag.html',
                controller: 'SearchTagController as vm'
            });
    }
})();