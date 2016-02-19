(function() {
    'use strict';

    angular
        .module('itw.ui')
        .directive('imod', IMod);

    IMod.$inject = ['$window', '_', 'api', '$sce'];

    function IMod($window, _, api, $sce) {
        return {
            restrict: 'EA',
            scope: {
                position: '@',
                catid: '@',
                rel: '@'
            },
            templateUrl: 'app/ui/imod/imod.html',
            link: function(scope) {
                var q = scope.position,
                    catid = scope.catid;

                scope.loading = 1;

                api('tag=sponsor&q=' + q + '&id=' + catid)
                    .then(function(response) {
                        angular.forEach(response, function(row, i) {
                            row.active = i === 0 ? 1 : 0;
                        });
                        scope.result = response; //$sce.trustAsHtml(response[0].content);

                    }).catch(function(response) {

                    }).finally(function() {
                        scope.loading = 0;
                    });

            },
            controller: ['$scope', function Controller($scope) {
                $scope.activate = function(item) {
                    angular.forEach($scope.result || [], function(row) {
                        if (angular.equals(row, item)) {
                            row.active = 1;
                        } else {
                            row.active = 0;
                        }
                    });
                };
            }]
        };
    }
})();