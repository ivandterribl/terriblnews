(function() {
    'use strict';

    angular
        .module('app.core')
        .run(Runnable);

    Runnable.$inject = [
        '$injector',
        '$rootScope',
        '$ionicPlatform',
        '$ionicSideMenuDelegate',
        //https://github.com/revolunet/angular-google-analytics
        //If you are relying on automatic page tracking, you need to inject Analytics at least once in your application.
        'Analytics'
    ];

    function Runnable($injector, $rootScope, $ionicPlatform, $ionicSideMenuDelegate, Analytics) {

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

        $rootScope.$on('$stateChangeSuccess', function stateChangeStart(event, toState, toParams, fromState, fromParams) {
            //console.log('$stateChangeSuccess:' + toState.name);
        });

        $rootScope.$on('$stateChangeError', function stateChangeStart(event, toState, toParams, fromState, fromParams) {
            //console.log('$stateChangeError:' + toState.name);
        });

        $rootScope.$on('$stateNotFound', function stateChangeStart(event, toState, toParams, fromState, fromParams) {
            //console.log('$stateNotFound:' + toState.name);
        });
    }
})();