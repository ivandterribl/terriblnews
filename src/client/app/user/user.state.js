(function() {
    'use strict';

    angular
        .module('itw.user')
        .config(Config);

    Config.$inject = ['$stateProvider'];

    function Config($stateProvider) {
        var skipIfLoggedIn = ['$q', '$location', '$auth', function($q, $location, $auth) {
            var deferred = $q.defer();
            if ($auth.isAuthenticated()) {
                $location.path('/user/profile');
            } else {
                deferred.resolve();
            }
            return deferred.promise;
        }];
        $stateProvider
            .state('app.user', {
                url: '/user',
                abstract: true,
                template: '<ion-view><ion-nav-view name="tabContent"></ion-nav-view></ion-view>'
            })
            .state('app.user.login', {
                url: '/login',
                params: {
                    redirect: {}
                },
                views: {
                    tabContent: {
                        templateUrl: 'app/user/login.html',
                        controller: 'LoginController as vm'
                    }
                },
                resolve: {
                    skipIfLoggedIn: skipIfLoggedIn,
                    seo: ['meta', function(meta) {
                        meta.set({
                            title: 'Login'
                        });
                        return true;
                    }]
                }
            })
            .state('app.user.signup', {
                url: '/signup',
                params: {
                    redirect: {}
                },
                views: {
                    tabContent: {
                        templateUrl: 'app/user/signup.html',
                        controller: 'SignupController as vm'
                    }
                },
                resolve: {
                    skipIfLoggedIn: skipIfLoggedIn
                }
            })
            .state('app.user.profile', {
                url: '/profile',
                views: {
                    tabContent: {
                        templateUrl: 'app/user/profile.html',
                        controller: 'ProfileController as vm'
                    }
                },
                resolve: {
                    loginRequired: ['user', '$q', '$location', function(user, $q, $location) {
                        var deferred = $q.defer();
                        if (user.isAuthenticated()) {
                            if (!user.profile) {
                                user.get()
                                    .then(function() {
                                        var cv = user.profile.careerweb.cv;
                                        if (cv.CVID) {
                                            user.career.applications()
                                                .finally(function() {
                                                    deferred.resolve();
                                                });
                                        } else {
                                            deferred.resolve();
                                        }
                                    })
                                    .catch(function() {
                                        $location.path('/user/login');
                                    });
                            } else if (user.profile.careerweb) {
                                var cv = user.profile.careerweb.cv;
                                if (cv && cv.CVID) {
                                    user.career.applications()
                                        .finally(function() {
                                            deferred.resolve();
                                        });
                                } else {
                                    deferred.resolve();
                                }
                            } else {
                                deferred.resolve();
                            }
                        } else {
                            $location.path('/user/login');
                        }
                        return deferred.promise;
                    }],
                    seo: ['meta', function(meta) {
                        meta.set({
                            title: 'My profile'
                        });
                        return true;
                    }]
                }
            })
            .state('app.user.activate', {
                url: '/activate?token',
                resolve: {
                    activation: ['$q', '$state', '$stateParams', '$http', '$auth', 'toastr',
                        function($q, $state, $stateParams, $http, $auth, toastr) {
                            var deferred = $q.defer();

                            $http.get('https://secure.itweb.co.za/api/accounts/activate', {
                                params: {
                                    token: $stateParams.token
                                }
                            }).then(function(response) {
                                $auth.setToken(response.data.access_token);

                                toastr.success('Thank you, your account is now active');

                                $state.go('app.user.profile');
                            }).catch(function(response) {
                                var data = response.data || {},
                                    error = data.error || {};

                                toastr.error(error.error_description, response.status);

                                $state.go('app.user.login');
                            });
                            return deferred.promise;
                        }
                    ]
                }
            })
            .state('app.user.authorize', {
                url: '/authorize?code',
                resolve: {
                    activation: ['$q', '$state', '$stateParams', '$http', '$auth', 'toastr',
                        function($q, $state, $stateParams, $http, $auth, toastr) {
                            var deferred = $q.defer(),
                                data = {
                                    client_id: 'itweb/app',
                                    client_secret: 'EpkSFB@2Nz9L',
                                    grant_type: 'authorization_code',
                                    redirect_uri: 'http://www.itweb.co.za/mobilesite/user/authorize',
                                    code: $stateParams.code
                                };

                            $http.post('https://secure.itweb.co.za/api/accounts/authorize', data, {
                                withCredentials: true
                            }).then(function(response) {
                                $auth.setToken(response.data.access_token);

                                toastr.success('Thank you, your account is now active');

                                $state.go('app.user.profile');
                            }).catch(function(response) {
                                var data = response.data || {},
                                    error = data.error || {};

                                toastr.error(error.error_description, response.status);

                                $state.go('app.user.login');
                            });
                            return deferred.promise;
                        }
                    ]
                }
            });

    }

})();