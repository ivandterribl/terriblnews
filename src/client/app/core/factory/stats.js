(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('stats', Stats);

    Stats.$inject = ['api'];

    function Stats(api) {
        return {
            log: log
        };

        function log(data) {
            data.ts = Math.random() * 10000000;
            console.log('%c' + angular.toJson(data), 'color:purple');
            api('/log', data);
        }
    }

})();