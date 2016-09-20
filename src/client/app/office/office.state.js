(function() {
    'use strict';

    angular
        .module('app.office')
        .config(Config);

    Config.$inject = ['$stateProvider'];

    function Config($stateProvider) {
        var resolveResponse = ['api', '$q', function(api, $q) {
            return $q.all({
                cz: api('/menu/cz'),
                vpo: api('/menu/vpo')
            });
        }];

        $stateProvider
            .state('app.office', {
                url: '/companies',
                params: {},
                templateUrl: 'app/office/office.html',
                controller: 'OfficeController as vm',
                resolve: {
                    response: resolveResponse
                }
            });
    }
})();