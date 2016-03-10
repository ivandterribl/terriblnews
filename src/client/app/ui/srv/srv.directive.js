(function() {
    'use strict';

    angular
        .module('itw.ui')
        .directive('adsrv', Adsrv);

    Adsrv.$inject = ['$window', '_', '$http', '$sce', '$timeout', '$ionicPosition'];

    function Adsrv($window, _, $http, $sce, $timeout, $ionicPosition) {
        // see https://api.jquery.com/offset/
        // see http://ionicframework.com/docs/api/service/$ionicPosition/
        function offset(elementSelector) {
            return $ionicPosition.offset(elementSelector);
        }

        // see https://api.jquery.com/position/
        // see http://ionicframework.com/docs/api/service/$ionicPosition/
        function position(elementSelector) {
            return $ionicPosition.position(elementSelector);
        }

        return {
            restrict: 'EA',
            scope: {
                what: '@'
            },
            require: '^$ionicScroll',
            templateUrl: 'app/ui/srv/srv.html',
            link: function(scope, $element, $attr, $ionicScroll) {
                var width,
                    height,
                    $scrollElement = angular.element($ionicScroll.element),
                    activated = 0;

                scope.loading = 1;
                if (scope.what === 'mobile-leaderboard') {
                    width = _.min([$window.innerWidth, 640]);
                    height = Math.floor(width / 320 * 50);
                } else if (scope.what === 'mobile-leaderboard-xx') {
                    width = _.min([$window.innerWidth, 640]);
                    height = Math.floor(width / 320 * 100);
                } else if (scope.what === 'mobile-square') {
                    width = _.min([$window.innerWidth - 20, 600]);
                    height = Math.floor(width / 300 * 250);
                } else if (scope.what.indexOf('top') === 0 || scope.what.indexOf('bot') === 0) {
                    width = _.min([$window.innerWidth - 24, 728]);
                    height = Math.floor(width / 728 * 90);

                } else if (scope.what.indexOf('tileone') === 0 || scope.what.indexOf('trigg3') === 0) {
                    width = 300;
                    height = 250;

                } else if (scope.what.indexOf('triggerone') === 0) {
                    width = 120;
                    height = 250;

                } else if (scope.what.indexOf('bigtrigg') === 0) {
                    width = _.min([$window.innerWidth - 24, 648]);
                    height = Math.floor(width / 648 * 180);

                } else if (scope.what.indexOf('noop') === 0) {
                    width = _.min([$window.innerWidth - 24, 648]);
                    height = Math.floor(width / 3);

                } else {
                    width = 300;
                    height = 250;
                }

                scope.width = width + 'px';
                scope.height = height + 'px';
                //$element.css('min-height', scope.height + 20);
                $element.css('max-height', (height + 20) + 'px');

                scope.$on('$destroy', function() {
                    $scrollElement.off('scroll');
                });

                var scrollOffset = $ionicPosition.offset($scrollElement),
                    calculateScrollLimits = function() {
                        var offset;

                        if (!activated) {
                            offset = $ionicPosition.offset($element);
                            if ((offset.top - scrollOffset.top - scrollOffset.height) < 0) {
                                console.log('%c' + scope.what + 'activated', 'color:red');
                                activate();
                            }
                        }
                    },
                    throttledCalculateScrollLimits = ionic.Utils.throttle(
                        calculateScrollLimits,
                        100, {
                            trailing: false
                        }
                    );

                $scrollElement.on('scroll', throttledCalculateScrollLimits);

                $timeout(calculateScrollLimits, 250);

                function activate() {
                    activated = 1;
                    $http({
                        method: 'GET',
                        url: 'http://ad.itweb.co.za/adjson.php?' +
                            'n=' + _.random(100000000) + '&what=' + scope.what + '&target=_new'
                    }).success(function(response) {
                        var result = _.get(response, 'html'),
                            el = document.createElement('div');

                        if (result) {
                            el.innerHTML = result;
                            if (el.querySelector('script')) {
                                result = null;
                            }
                        }
                        if (!result) {
                            result = '<img src="http://placehold.it/' + width + 'x' + height + '">';
                        }
                        scope.result = $sce.trustAsHtml(result);

                    }).error(function(response) {
                        console.log('adsrv:0', response);
                    }).finally(function() {
                        scope.loading = 0;
                    });
                }
            }
        };
    }
})();