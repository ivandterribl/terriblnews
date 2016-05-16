(function() {
    'use strict';

    angular
        .module('app.office')
        .config(Config);

    Config.$inject = ['$stateProvider'];

    function Config($stateProvider) {
        var resolveNav = ['nav', 'meta', '_', '$stateParams', function(nav, meta, _, $stateParams) {
                var group = _.find(nav.get(), function(group) {
                        return _.findWhere(group.items || [], {
                            id: $stateParams.id
                        });
                    }),
                    item = _.findWhere(group.items || [], {
                        id: $stateParams.id
                    });

                meta.set({
                    title: item ? item.title : void 0,
                    keywords: item ? item.title + ', IT, Technology, Business, News' : void 0
                });
                return item;
            }],
            resolveResponse = ['api', '$stateParams', function(api, $stateParams) {
                return api('tag=' + $stateParams.id);
            }];

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
                },
                resolve: {
                    activeNav: resolveNav,
                    response: resolveResponse
                }
            })
            .state('app.office.zones', {
                url: '/zones',
                params: {
                    id: 'company-zones'
                },
                views: {
                    tabContent: {
                        templateUrl: 'app/office/microsites.html',
                        controller: 'OfficeController as vm'
                    }
                },
                resolve: {
                    activeNav: resolveNav,
                    response: resolveResponse
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
                },
                resolve: {
                    activeNav: resolveNav,
                    response: resolveResponse
                }
            });
    }
})();