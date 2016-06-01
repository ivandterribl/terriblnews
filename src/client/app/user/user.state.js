(function() {
    'use strict';

    angular
        .module('itw.user')
        .config(Config);

    Config.$inject = ['$stateProvider'];

    function Config($stateProvider) {
        var items = [{
            title: 'Login',
            id: 'login',
            state: {
                name: 'app.user.login'
            }
        }, {
            title: 'Sign up',
            id: 'signup',
            state: {
                name: 'app.user.signup'
            }
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
                    skipIfLoggedIn: skipIfLoggedIn
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
                    loginRequired: loginRequired
                }
            })
            .state('app.user.activate', {
                url: '/activate?token',
                resolve: {
                    activation: function($q, $state, $stateParams, $http, $auth, toastr) {
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
                }
            });

        function skipIfLoggedIn($q, $location, $auth) {
            var deferred = $q.defer();
            if ($auth.isAuthenticated()) {
                $location.path('/user/profile');
            } else {
                deferred.resolve();
            }
            return deferred.promise;
        }

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