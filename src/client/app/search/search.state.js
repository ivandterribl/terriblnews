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
                controller: 'SearchController as vm',
                resolve: {
                    response: ['api', 'meta', '$q', '$stateParams', function(api, meta, $q, $stateParams) {
                        var deferred = $q.defer();
                        meta.set({
                            title: $stateParams.q + ' - Search'
                        });
                        api('tag=search&q=' + $stateParams.q + '&limitstart=0&limit=25')
                            .then(function(response) {
                                deferred.resolve(response);
                            })
                            .catch(function() {
                                deferred.resolve([]);
                            });

                        return deferred.promise;
                    }]
                }
            })
            .state('app.topic', {
                url: '/topic?q',
                templateUrl: 'app/search/searchtag.html',
                controller: 'SearchTagController as vm',
                resolve: {
                    response: ['api', 'meta', '$stateParams', function(api, meta, $stateParams) {
                        meta.set({
                            title: $stateParams.q + ' news archive'
                        });
                        return api('tag=searchtag&q=' + $stateParams.q + '&limitstart=0&limit=25');
                    }]
                }
            });
    }
})();