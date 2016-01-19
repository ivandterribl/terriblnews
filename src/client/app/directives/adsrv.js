(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('adsrv', Adsrv);

    Adsrv.$inject = ['$window', '_', '$http'];

    function Adsrv($window, _, $http) {
        return {
            restrict: 'E',
            scope: {
                what: '@',
                width: '@',
                height: '@'
            },
            templateUrl: 'app/directives/adsrv.html',
            link: function(scope) {
                scope.loading = 1;
                console.log('adsrv', scope);
                $http({
                    method: 'GET',
                    url: 'http://adsrv.itweb.co.za/adjs.php?n=' + _.random(100000000) + '&what=' + scope.what + '&target=_new'
                }).success(function(response) {
                    console.log('adsrv:1', response);
                    var a = response.split('\n'),
                        b = a[7].split(' += ')[1];

                    console.log(b);
                    console.log(scope.$eval(b));
                }).error(function(response) {
                    console.log('adsrv:0', response);
                }).finally(function() {
                    //scope.loading = 0;
                });
            }
        };
    }
})();