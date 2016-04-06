(function() {
    'use strict';

    angular
        .module('app.about')
        .config(Config);

    Config.$inject = ['$stateProvider'];

    function Config($stateProvider) {
        $stateProvider
            .state('app.about', {
                url: '/about',
                params: {
                    nav: 'About'
                },
                abstract: true,
                templateUrl: 'app/core/tabs/tabs.html',
                controller: 'TabsController as vm'
            })
            .state('app.about.us', {
                url: '/us',
                views: {
                    tabContent: {
                        templateUrl: 'app/about/about.html',
                        controller: 'AboutController as vm'
                    }
                },
                resolve: {
                    aboutHtml: ['api', function(api) {
                        return api('tag=about');
                    }],
                    seo: ['meta', function(meta) {
                        return meta.set({
                            title: 'About us'
                        });
                    }]
                }
            })
            .state('app.about.contact', {
                url: '/contact',
                views: {
                    tabContent: {
                        templateUrl: 'app/about/contact-us.html'
                    }
                },
                resolve: {
                    seo: ['meta', function(meta) {
                        return meta.set({
                            title: 'Contact us'
                        });
                    }]
                }
            })
            .state('app.about.privacy', {
                url: '/privacy',
                views: {
                    tabContent: {
                        templateUrl: 'app/about/privacy-policy.html'
                    }
                },
                resolve: {
                    seo: ['meta', function(meta) {
                        return meta.set({
                            title: 'Privacy policy'
                        });
                    }]
                }
            })
            .state('app.about.competition', {
                url: '/competition',
                views: {
                    tabContent: {
                        templateUrl: 'app/about/competition-policy.html'
                    }
                },
                resolve: {
                    seo: ['meta', function(meta) {
                        return meta.set({
                            title: 'Competition policy'
                        });
                    }]
                }
            })
            .state('app.about.bee', {
                url: '/bee',
                views: {
                    tabContent: {
                        templateUrl: 'app/about/bee.html'
                    }
                },
                resolve: {
                    seo: ['meta', function(meta) {
                        return meta.set({
                            title: 'BEE certificate'
                        });
                    }]
                }
            });
    }
})();