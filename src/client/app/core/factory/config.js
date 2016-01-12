(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('config', Config);

    Config.$inject = ['_'];

    function Config(_) {
        var environments = {
            dev: {
                url: 'http://www.itweb.co.za/',
                tnirpregnif: [],
                analyticsId: null
            },
            prod: {
                url: 'http://www.itweb.co.za/',
                tnirpregnif: [],
                analyticsId: null
            }
        };
        // change arg to dev|prod...
        return environment('dev');

        function environment(env) {
            var defaults = {
                timeout: 20000,
                log: 1
            };
            return _.assign(defaults, environments[env]);
        }
    }
})();