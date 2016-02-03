(function() {
    'use strict';

    angular
        .module('app.office')
        .config(Config);

    Config.$inject = ['$stateProvider'];

    function Config($stateProvider) {
        $stateProvider
            .state('app.office', {
                url: '/office',
                abstract: true,
                params: {
                    nav: 'Companies'
                },
                templateUrl: 'app/office/office-tabs.html',
                controller: 'OfficeTabsController as vm'
            })
            .state('app.office.news', {
                url: '/news',
                params: {
                    id: 'in-the-news'
                },
                views: {
                    tabContent: {
                        templateUrl: 'app/office/office.html',
                        controller: 'OfficeController as vm'
                    }
                }
            })
            .state('app.office.vpo', {
                url: '/virtual-press-office',
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
                url: '/company-zones',
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
                url: '/microsites',
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