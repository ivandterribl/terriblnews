(function() {
    'use strict';

    angular
        .module('itw.ui')
        .directive('itwTabBar', tabBar);

    tabBar.$inject = [];

    function tabBar() {
        return {
            restrict: 'EA',
            templateUrl: 'app/ui/tab-bar/tab-bar.html',
            scope: {
                active: '@'
            }
        };
    }
})();