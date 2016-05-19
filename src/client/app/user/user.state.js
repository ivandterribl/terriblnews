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
                name: 'app.user.login'
            }
        }];
        $stateProvider
            .state('app.user', {
                url: '/user',
                abstract: true,
                params: {
                    nav: 'User'
                },
                templateUrl: 'app/core/tabs/tabs.html',
                controller: 'TabsController as vm'
            })
            .state('app.user.login', {
                url: '/:id',
                params: {
                    id: null
                },
                views: {
                    tabContent: {
                        templateUrl: function($stateParams) {
                            return 'app/user/' + $stateParams.id + '.html'
                        },
                        controller: 'LoginController as vm'
                    }
                }
            })
            .state('app.user.signup', {
                url: '/signup',
                params: {
                    active: items[1]
                },
                views: {
                    tabContent: {
                        templateUrl: 'app/user/signup.html',
                        controller: 'SignupController as vm'
                    }
                }
            });
    }

})();