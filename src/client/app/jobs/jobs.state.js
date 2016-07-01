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
                        if (user.isAuthenticated() && !user.profile) {
                            user.get()
                                .then(function() {
                                    user.career.applications()
                                        .then(function() {
                                            deferred.resolve(user);
                                        })
                                        .catch(function() {
                                            deferred.resolve(user);
                                        });
                                })
                                .catch(function() {
                                    deferred.resolve(user);
                                });
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
            .state('app.jobs.search', {
                url: '/search?q',
                views: {
                    '@app': {
                        templateUrl: 'app/jobs/job-search.html',
                        controller: 'JobSearchController as vm'
                    }
                },
                resolve: {
                    response: ['api2', '$q', '$stateParams', function(api2, $q, $stateParams) {
                        var deferred = $q.defer();
                        api2('jobs/search?q=' + encodeURIComponent($stateParams.q))
                            .then(function(response) {
                                deferred.resolve(response);
                            })
                            .catch(function() {
                                deferred.reject([]);
                            });

                        return deferred.promise;
                    }]
                }
            })
            .state('app.jobs.profile-1', {
                url: '/profile/1',
                views: {
                    '@app': {
                        templateUrl: 'app/jobs/cv.main.html',
                        controller: 'CvMainController as vm'
                    }
                },
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('app.jobs.profile-2', {
                url: '/profile/2',
                views: {
                    '@app': {
                        templateUrl: 'app/jobs/cv.skills.html',
                        controller: 'CvSkillsController as vm'
                    }
                },
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('app.jobs.profile-3', {
                url: '/profile/3',
                views: {
                    '@app': {
                        templateUrl: 'app/jobs/cv.education.html',
                        controller: 'CvEducationController as vm'
                    }
                },
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('app.jobs.profile-3-form', {
                url: '/profile/3/form',
                views: {
                    '@app': {
                        templateUrl: 'app/jobs/cv.education.form.html'
                    }
                },
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('app.jobs.profile-4', {
                url: '/profile/4',
                views: {
                    '@app': {
                        templateUrl: 'app/jobs/cv.employment.html',
                        controller: 'CvEmploymentController as vm'
                    }
                },
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('app.jobs.profile-5', {
                url: '/profile/5',
                views: {
                    '@app': {
                        templateUrl: 'app/jobs/cv.wishlist.html',
                        controller: 'CvWishlistController as vm'
                    }
                },
                resolve: {
                    loginRequired: loginRequired
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
                }
            });

        function loginRequired($q, $location, $auth) {
            var deferred = $q.defer();
            if ($auth.isAuthenticated()) {
                deferred.resolve();
            } else {
                $location.path('/user/login');
            }
            return deferred.promise;
        }
    }
})();