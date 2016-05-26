(function() {
    'use strict';

    angular
        .module('itw.jobs')
        .config(Config);

    Config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function Config($stateProvider, $urlRouterProvider) {
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
        }];

        $stateProvider
            .state('app.jobs', {
                url: '/jobs',
                abstract: true,
                params: {
                    nav: 'Jobs'
                },
                templateUrl: 'app/core/tabs/tabs.html',
                controller: 'TabsController as vm'
            })
            .state('app.jobs.feed', {
                params: {
                    id: null,
                    subheader: 1
                },
                url: '/:id',
                views: {
                    tabContent: {
                        templateUrl: 'app/jobs/jobs.html',
                        controller: 'JobsController as vm'
                    }
                },
                resolve: {
                    activeNav: resolveNav
                }
            })
            .state('app.job', {
                url: '/job/:id',
                params: {
                    job: null
                },
                templateUrl: 'app/jobs/job.html',
                controller: 'JobController as vm'
            });
    }
})();