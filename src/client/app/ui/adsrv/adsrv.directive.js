(function() {
    'use strict';

    angular
        .module('app.core')
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
                scope.loading = 1;
                console.log('adsrv', scope);
                $http({
                    method: 'GET',
                    url: 'http://adsrv.itweb.co.za/adjson.php?' +
                        'n=' + _.random(100000000) + '&what=' + scope.what + '&target=_new'
                }).success(function(response) {
                    scope.result = response.html;
                }).error(function(response) {
                    console.log('adsrv:0', response);
                }).finally(function() {
                    scope.loading = 0;
                });
            }
        };
    }
})();