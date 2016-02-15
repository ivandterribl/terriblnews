(function() {
    'use strict';

    angular
        .module('app.frontpage')
        .config(Config);

    Config.$inject = ['$stateProvider'];

    function Config($stateProvider) {
        $stateProvider
            .state('app.frontpage', {
                url: '/frontpage',
                templateUrl: 'app/frontpage/frontpage2.html',
                controller: 'FrontpageController as vm'
            });
    }
})();