(function() {
    'use strict';

    angular
        .module('itw.ui')
        .directive('adsrv', Adsrv);

    Adsrv.$inject = ['$window', '_', '$http'];

    function Adsrv($window, _, $http) {
        return {
            restrict: 'EA',
            scope: {
                what: '@',
                width: '@',
                height: '@'
            },
            templateUrl: 'app/ui/adsrv/adsrv.html',
            link: function(scope) {
                var placeholder;
                scope.loading = 1;
                if (scope.what.indexOf('top') === 0 || scope.what.indexOf('bot') === 0) {
                    placeholder = (window.innerWidth - 20) + 'x' + Math.floor((window.innerWidth - 20) / 728 * 90);
                } else if (scope.what.indexOf('tileone') === 0) {
                    placeholder = '300x250';
                } else if (scope.what.indexOf('triggerone') === 0) {
                    placeholder = '120x250';
                }
                $http({
                    method: 'GET',
                    url: 'http://adsrv.itweb.co.za/adjson.php?' +
                        'n=' + _.random(100000000) + '&what=' + scope.what + '&target=_new'
                }).success(function(response) {
                    var result = _.get(response, 'html');
                    if (!result && placeholder) {
                        result = '<img src="http://placehold.it/' + placeholder + '">';
                    }
                    scope.result = result;

                }).error(function(response) {
                    console.log('adsrv:0', response);
                }).finally(function() {
                    scope.loading = 0;
                });
            }
        };
    }
})();