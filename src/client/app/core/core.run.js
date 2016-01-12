(function() {
    'use strict';

    angular
        .module('app.core')
        .run(Runnable);

    Runnable.$inject = [
        '$injector',
        '$ionicPlatform'
    ];

    function Runnable($injector, $ionicPlatform) {

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
    }
})();