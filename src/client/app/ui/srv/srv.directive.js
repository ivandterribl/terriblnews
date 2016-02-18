(function() {
    'use strict';

    angular
        .module('itw.ui')
        .directive('adsrv', Adsrv);

    Adsrv.$inject = ['$window', '_', '$http', '$sce'];

    function Adsrv($window, _, $http, $sce) {
        return {
            restrict: 'EA',
            scope: {
                what: '@'
            },
            templateUrl: 'app/ui/srv/srv.html',
            link: function(scope, $element) {
                var width,
                    height;

                scope.loading = 1;
                if (scope.what.indexOf('top') === 0 || scope.what.indexOf('bot') === 0) {
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

                } else {
                    width = 300;
                    height = 150;
                }

                scope.width = width + 'px';
                scope.height = height + 'px';
                $element.css('max-height', scope.height);

                setTimeout(function() {
                    $http({
                        method: 'GET',
                        url: 'http://adsrv.itweb.co.za/adjson.php?' +
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
                }, 350);
            }
        };
    }
})();