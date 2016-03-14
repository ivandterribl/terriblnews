(function() {
    'use strict';

    angular
        .module('app.core')
        .run(Runnable);

    Runnable.$inject = [
        'stats',
        '$injector',
        '$rootScope',
        '$ionicPlatform',
        '$state',
        //https://github.com/revolunet/angular-google-analytics
        //If you are relying on automatic page tracking, you need to inject Analytics at least once in your application.
        'Analytics'
    ];

    function Runnable(stats, $injector, $rootScope, $ionicPlatform, $state, Analytics) {

        $ionicPlatform.ready(function() {
            var cordova = window.cordova,
                StatusBar = window.StatusBar;

            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (cordova && cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleBlackTranslucent();
            }
            // DEV: Expose $injector for console
            window.$i = $injector;
        });

        $rootScope.$on('$stateChangeStart', function stateChangeStart(event, toState, toParams, fromState, fromParams) {
            //console.log('$stateChangeStart:' + toState.name);
            //$ionicSideMenuDelegate.toggleLeft(false);
        });

        $rootScope.$on('$stateChangeSuccess', function stateChangeSuccess(event, toState, toParams, fromState, fromParams) {
            // article is logged after we have a catId
            if (toState.name !== 'app.article') {
                var data = {
                    loc: $state.href(toState.name, toParams),
                    ts: _.random(1000000000)
                };

                stats.log(data);
            }
        });

        $rootScope.$on('$stateChangeError', function stateChangeError(event, toState, toParams, fromState, fromParams) {
            //console.log('$stateChangeError:' + toState.name);
        });

        $rootScope.$on('$stateNotFound', function stateNotFound(event, toState, toParams, fromState, fromParams) {
            //console.log('$stateNotFound:' + toState.name);
        });
    }
})();