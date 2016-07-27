(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('stats', Stats);

    Stats.$inject = ['$http', '$location'];

    function Stats($http, $location) {
        return {
            log: logStats
        };

        function logStats(data) {
            console.log('%c' + angular.toJson(data), 'color:purple');
            if ($location.host() !== 'localhost') {
                $http({
                    method: 'GET',
                    url: 'http://stats.itweb.co.za/mobicount.asp',
                    params: data
                });
            }
        }
    }

})();