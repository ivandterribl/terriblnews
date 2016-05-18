(function() {
    'use strict';

    angular
        .module('itw.user')
        .config(Config);

    Config.$inject = ['$stateProvider'];

    function Config($stateProvider) {
        $stateProvider
            .state('app.user', {
                url: '/user',
                abstract: true,
                params: {
                    items: [{
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
                    }]
                },
                templateUrl: 'app/core/tabs/tabs.html',
                controller: 'TabsController as vm'
            })
            .state('app.user.login', {
                url: '/login',
                views: {
                    tabContent: {
                        templateUrl: 'app/user/login.html',
                        controller: 'LoginController as vm'
                    }
                }
            })
            .state('app.user.signup', {
                url: '/signup',
                params: {
                    id: 'signup'
                },
                views: {
                    tabContent: {
                        templateUrl: 'app/user/signup.html',
                        controller: 'LoginController as vm'
                    }
                }
            });
    }

})();