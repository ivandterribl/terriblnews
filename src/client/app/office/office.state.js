(function() {
    'use strict';

    angular
        .module('app.office')
        .config(Config);

    Config.$inject = ['$stateProvider'];

    function Config($stateProvider) {
        $stateProvider
            .state('app.office', {
                url: '/companies',
                abstract: true,
                params: {
                    nav: 'Companies'
                },
                templateUrl: 'app/core/tabs/tabs.html',
                controller: 'TabsController as vm'
            })
            .state('app.office.vpo', {
                url: '/press-offices',
                params: {
                    id: 'virtual-press-office'
                },
                views: {
                    tabContent: {
                        templateUrl: 'app/office/office.html',
                        controller: 'OfficeController as vm'
                    }
                }
            })
            .state('app.office.zones', {
                url: '/zones',
                params: {
                    id: 'company-zones'
                },
                views: {
                    tabContent: {
                        templateUrl: 'app/office/office.html',
                        controller: 'OfficeController as vm'
                    }
                }
            })
            .state('app.office.microsites', {
                url: '/sites',
                params: {
                    id: 'microsites'
                },
                views: {
                    tabContent: {
                        templateUrl: 'app/office/microsites.html',
                        controller: 'OfficeController as vm'
                    }
                }
            });
    }
})();