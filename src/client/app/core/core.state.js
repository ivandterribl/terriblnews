(function() {
    'use strict';

    angular
        .module('app.core')
        .config(Config);

    Config.$inject = ['$stateProvider', '$locationProvider'];

    function Config($stateProvider, $locationProvider) {
        $stateProvider
            .state('app', {
                url: '',
                abstract: true,
                templateUrl: 'app/core/core.html',
                controller: 'CoreController as vm'
            });

        // if none of the above states are matched, use this as the fallback
        $locationProvider.html5Mode(true).hashPrefix('!');
    }
})();
