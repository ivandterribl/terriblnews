(function() {
    'use strict';

    angular
        .module('itw.jobs')
        .config(Config);

    Config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function Config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app.jobs.profile-1', {
                url: '/cv/main',
                views: {
                    '@app': {
                        templateUrl: 'app/jobs/cv/cv.main.html',
                        controller: 'CvMainController as vm'
                    }
                },
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('app.jobs.profile-2', {
                url: '/cv/skills',
                views: {
                    '@app': {
                        templateUrl: 'app/jobs/cv/cv.skills.html',
                        controller: 'CvSkillsController as vm'
                    }
                },
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('app.jobs.profile-3', {
                url: '/cv/education',
                views: {
                    '@app': {
                        templateUrl: 'app/jobs/cv/cv.education.html',
                        controller: 'CvEducationController as vm'
                    }
                },
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('app.jobs.profile-4', {
                url: '/cv/employment',
                views: {
                    '@app': {
                        templateUrl: 'app/jobs/cv/cv.employment.html',
                        controller: 'CvEmploymentController as vm'
                    }
                },
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('app.jobs.profile-5', {
                url: '/cv/wishlist',
                views: {
                    '@app': {
                        templateUrl: 'app/jobs/cv/cv.wishlist.html',
                        controller: 'CvWishlistController as vm'
                    }
                },
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('app.jobs.profile-6', {
                url: '/cv/documents',
                views: {
                    '@app': {
                        templateUrl: 'app/jobs/cv/cv.documents.html'
                    }
                },
                resolve: {
                    loginRequired: loginRequired
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