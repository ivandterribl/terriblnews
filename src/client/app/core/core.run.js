(function() {
    'use strict';

    angular
        .module('app.core')
        .run(Runnable);

    Runnable.$inject = [
        'stats',
        '_',
        '$timeout',
        '$injector',
        '$rootScope',
        '$ionicLoading',
        '$state',
        '$window',
        '$location',
        //https://github.com/revolunet/angular-google-analytics
        //If you are relying on automatic page tracking, you need to inject Analytics at least once in your application.
        'Analytics'
    ];

    function Runnable(stats, _, $timeout, $injector, $rootScope, $ionicLoading, $state, $window, $location, Analytics) {
        $timeout(function() {
            document.getElementsByClassName('backdrop')[0].remove();
        }, 350);

        $window.$i = $injector;

        $rootScope.$on('$stateChangeStart', function stateChangeStart(event, toState, toParams, fromState, fromParams) {
            if (angular.isDefined(toState.resolve)) {
                $ionicLoading.show();
            }
        });

        $rootScope.$on('$stateChangeSuccess', function stateChangeSuccess(event, toState, toParams, fromState, fromParams) {
            var url = $state.href(toState.name, toParams),
                catId;

            if (angular.isDefined(toState.resolve)) {
                // off the android back button this doesnt close the show()
                // fix? delay a tick, counter-effect resolved promises flash a loading screen

                $ionicLoading.hide();
            }

            // jshint ignore:start
            switch (toState.name) {
                case 'app.article-raw':
                case 'app.article':
                case 'app.section':
                case 'app.event':
                    // logged separately
                    break;
                case 'app.frontpage':
                    catId = 10000;
                    break;
                case 'app.news.category':
                case 'app.news.africa':
                    catId = 10001;
                    break;
                case 'app.sections':
                    catId = 10002;
                    break;
                case 'app.opinion.category':
                    switch (toParams.id) {
                        case 'tech-forum':
                            catId = 355;
                            break;
                        case 'industry-insight':
                            catId = 143;
                            break;
                        default:
                            catId = 79;
                    }
                    break;
                case 'app.office.news':
                case 'app.office.vpo':
                case 'app.office.zones':
                case 'app.office.microsites':
                    catId = 10200;
                    break;
                case 'app.events':
                    catId = 10100;
                    break;
                case 'app.about.us':
                case 'app.about.contact':
                case 'app.about.privacy':
                case 'app.about.competition':
                case 'app.about.bee':
                    catId = 10300;
                    break;
                case 'app.search':
                    catId = 10500;
                    break;
                case 'app.topic':
                    catId = 10501;
                    break;
                default:
                    //debugger;
            }
            if (catId) {
                var data = {
                    catid: catId,
                    loc: url,
                    ts: _.random(1000000000)
                };
                stats.log(data);
            }
            // jshint ignore:end
        });

        $rootScope.$on('$locationChangeSuccess', function stateChangeError(event, toUrl) {
            if ($window._em) {
                $window._em.trackAjaxPageview($location.url());
            }
        });

        $rootScope.$on('$stateChangeError', function stateChangeError(event, toState, toParams, fromState, fromParams) {
            console.log('$stateChangeError', arguments);
            //debugger;
            $ionicLoading.hide();
        });

        $rootScope.$on('$stateNotFound', function stateNotFound(event, toState, toParams, fromState, fromParams) {
            console.log('$stateNotFound', arguments);
            //debugger;
            $ionicLoading.hide();
        });
    }
})();