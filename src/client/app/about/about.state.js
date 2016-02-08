(function() {
    'use strict';

    angular
        .module('app.about')
        .config(Config);

    Config.$inject = ['$stateProvider'];

    function Config($stateProvider) {
        $stateProvider
            .state('app.about-us', {
                url: '/about-us',
                templateUrl: 'app/about/about.html'
            });
    }
})();