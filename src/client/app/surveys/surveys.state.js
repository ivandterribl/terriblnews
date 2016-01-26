(function() {
    'use strict';

    angular
        .module('app.surveys')
        .config(Config);

    Config.$inject = ['$stateProvider'];

    function Config($stateProvider) {
        $stateProvider
            .state('app.surveys', {
                params: {
                    id: 'surveys'
                },
                url: '/surveys',
                templateUrl: 'app/surveys/surveys.html',
                controller: 'NewsController as vm'
            });
    }
})();