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
            var data = {
                loc: $state.href(toState.name, toParams)
            };

            if (angular.isDefined(toState.resolve)) {
                // off the android back button this doesnt close the show()
                // fix? delay a tick, counter-effect resolved promises flash a loading screen

                $ionicLoading.hide();
            }

            // jshint ignore:start
            switch (toState.name) {
                case 'app.article':
                    break;
                case 'app.location':
                    data.catid = 11000;
                    break;
                case 'app.search':
                    data.catid = 10500;
                    break;
                case 'app.topic':
                    data.catid = 10501;
                    break;
                case 'app.office':
                    data.catid = 10200;
                    break;
                default:
                    data.catid = toParams.id || 10000;
            }
            if (data.catid) {
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
            $ionicLoading.hide();
        });

        $rootScope.$on('$stateNotFound', function stateNotFound(event, toState, toParams, fromState, fromParams) {
            $ionicLoading.hide();
        });
    }
})();