(function() {
    'use strict';

    angular
        .module('app.cioZone')
        .config(Config);

    Config.$inject = ['$stateProvider'];

    function Config($stateProvider) {
        $stateProvider
            .state('app.cioZone', {
                params: {
                    id: 'cio-zone'
                },
                url: '/cio-zone',
                templateUrl: 'app/news/section/section.html',
                controller: 'SectionController as vm'
            });
    }
})();