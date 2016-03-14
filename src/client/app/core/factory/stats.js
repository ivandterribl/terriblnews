(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('stats', Stats);

    Stats.$inject = ['$http'];

    function Stats($http) {
        var queue = [];

        return {
            log: logStats
        };

        function logStats(data) {
            console.log('%c' + angular.toJson(data), 'color:purple');
            $http({
                method: 'GET',
                url: 'http://stats.itweb.co.za/mobicount.asp',
                data: data
            });
        }
    }

})();