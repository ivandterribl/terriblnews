 (function() {
     'use strict';

     var raw = ionic.Platform.navigator.appVersion.match(/Chrom(e|ium)\/([0-9]+)\./),
         chromever = raw ? parseInt(raw[2], 10) : false;

     if (chromever >= 53) {
         angular
             .module('ionic')
             .directive('selectPolyfill', avoidTap);
     }

     function avoidTap() {
         return {
             restrict: 'A',
             // scope: '=',
             link: function(scope, elem) {
                 elem.attr('data-tap-disabled', 'true');
             }
         };
     }
 })();