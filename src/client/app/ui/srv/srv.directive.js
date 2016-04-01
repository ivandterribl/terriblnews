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
                if (scope.what.indexOf('top') === 0 || scope.what.indexOf('bot') === 0) {
                    width = 320;
                    height = 50;

                } else if (scope.what.indexOf('dbl') === 0) {
                    width = 320;
                    height = 100;

                } else {
                    width = 300;
                    height = 250;
                }

                scope.width = width + 'px';
                scope.height = height + 'px';
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
                                //console.log('%c' + scope.what + '\tactivated', 'color:red');
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
                        var result = response.html,
                            el = document.createElement('div');

                        if (result) {
                            el.innerHTML = result;
                            if (el.querySelector('script')) {
                                result = null;
                            }
                        }
                        if (!result) {
                            //result = '<img src="http://placehold.it/' + width + 'x' + height + '">';
                            $element.remove();
                        } else {
                            scope.result = $sce.trustAsHtml(result);
                        }
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