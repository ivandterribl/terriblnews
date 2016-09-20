(function() {
    'use strict';

    angular
        .module('app.search')
        .config(Config);

    Config.$inject = ['$stateProvider'];

    function Config($stateProvider) {
        var resolveResults = ['api', 'meta', '$stateParams', function(api, meta, $stateParams) {
            meta.set({
                title: $stateParams.q + ' news '
            });
            return api('/search?q=' + $stateParams.q + '&limitstart=0');
        }];
        $stateProvider
            .state('app.search', {
                url: '/search?q',
                templateUrl: 'app/search/search.html',
                controller: 'SearchController as vm',
                resolve: {
                    response: resolveResults
                }
            })
            .state('app.topic', {
                url: '/topic?q',
                templateUrl: 'app/search/search.html',
                controller: 'SearchController as vm',
                resolve: {
                    response: resolveResults
                }
            });
    }
})();