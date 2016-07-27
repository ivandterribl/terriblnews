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
                    title: item ? item.title + ' Jobs' : void 0,
                    keywords: item ? item.title + ', IT, Technology, Business, News' : void 0
                });
                return item;
            }],
            resolveJobs = ['api2', 'meta', '$q', '$stateParams', function(api2, meta, $q, $stateParams) {
                return api2('jobs/category/' + $stateParams.id + '?limit=16')
                    .then(function(response) {
                        return response;
                    });
            }],
            items = [{
                title: 'IT',
                id: 'it,sect_id-1',
                state: {
                    name: 'app.jobs.tabs.feed',
                    params: {
                        id: 'it,sect_id-1'
                    }
                }
            }, {
                title: 'Financial',
                id: 'financial,sect_id-2',
                state: {
                    name: 'app.jobs.tabs.feed',
                    params: {
                        id: 'financial,sect_id-2'
                    }
                }
            }, {
                title: 'Engineering',
                id: 'engineering,sect_id-3',
                state: {
                    name: 'app.jobs.tabs.feed',
                    params: {
                        id: 'engineering,sect_id-3'
                    }
                }
            }, {
                title: 'Sales',
                id: 'sales,sect_id-4',
                state: {
                    name: 'app.jobs.tabs.feed',
                    params: {
                        id: 'sales,sect_id-4'
                    }
                }
            }];

        $stateProvider
            .state('app.jobs', {
                url: '/jobs',
                abstract: true,
                resolve: {
                    profile: ['user', '$q', function(user, $q) {
                        var deferred = $q.defer();
                        if (user.isAuthenticated()) {
                            if (!user.profile) {
                                user.get()
                                    .then(function() {
                                        var cv = user.profile.careerweb.cv;
                                        if (cv.CVID) {
                                            user.career.applications()
                                                .then(function() {
                                                    deferred.resolve(user);
                                                })
                                                .catch(function() {
                                                    deferred.resolve(user);
                                                });
                                        }
                                    })
                                    .catch(function() {
                                        deferred.resolve(user);
                                    });
                            } else if (user.profile.careerweb && !user.profile.careerweb.applications) {
                                user.career.applications()
                                    .then(function() {
                                        deferred.resolve(user);
                                    })
                                    .catch(function() {
                                        deferred.resolve(user);
                                    });
                            } else {
                                deferred.resolve(user);
                            }
                        } else {
                            deferred.resolve(user);
                        }
                        return deferred.promise;
                    }]
                }
            })
            .state('app.jobs.tabs', {
                url: '/section',
                abstract: true,
                params: {
                    items: items
                },
                views: {
                    '@app': {
                        templateUrl: 'app/core/tabs/tabs.html',
                        controller: 'TabsController as vm'
                    }
                }
            })
            .state('app.jobs.tabs.feed', {
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
                    activeNav: resolveNav,
                    jobs: resolveJobs
                }
            })
            .state('app.jobs.applications', {
                url: '/applications',
                views: {
                    '@app': {
                        templateUrl: 'app/jobs/job-applications.html',
                        controller: 'JobApplicationsController as vm'
                    }
                },
                resolve: {
                    seo: ['meta', function(meta) {
                        meta.set({
                            title: 'My job applications'
                        });
                        return true;
                    }]
                }
            })
            .state('app.jobs.search', {
                url: '/search?q',
                views: {
                    '@app': {
                        templateUrl: 'app/jobs/job-search.html',
                        controller: 'JobSearchController as vm'
                    }
                },
                resolve: {
                    response: ['api2', '$q', '$stateParams', 'meta', function(api2, $q, $stateParams, meta) {
                        var deferred = $q.defer();
                        api2('jobs/search?q=' + encodeURIComponent($stateParams.q))
                            .then(function(response) {
                                meta.title('Job search - ' + $stateParams.q);
                                meta.description('South African job offers relating to ' + $stateParams.q);
                                meta.keywords($stateParams.q + ', jobs');
                                meta.ld(false);
                                meta.canonical(false);
                                deferred.resolve(response);
                            })
                            .catch(function() {
                                deferred.reject([]);
                            });

                        return deferred.promise;
                    }]
                }
            })
            .state('app.jobs.job', {
                url: '/:id',
                params: {
                    job: null
                },
                views: {
                    '@app': {
                        templateUrl: 'app/jobs/job.html',
                        controller: 'JobController as vm'
                    }
                },
                resolve: {
                    response: ['api2', '$q', '$stateParams', 'meta', function(api2, $q, $stateParams, meta) {
                        return api2('jobs/job/' + $stateParams.id)
                            .then(function(response) {
                                meta.title(response.JobTitle);
                                meta.description(response.JobDescBrief);
                                meta.keywords(response.KeyWords + ', jobs, job posting, job offer, ' + response.Name);
                                meta.ld(false);
                                meta.canonical('http://www.careerweb.co.za/Common/ViewJob.asp?JobID=' + response.JobID);

                                return response;
                            });
                    }]
                }
            });
    }
})();