(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('config', Config);

    Config.$inject = ['_'];

    function Config(_) {
        var environments = {
            prod: {
                url: 'http://www.itweb.co.za/',
                tnirpregnif: [],
                analyticsId: null
            }
        };
        // change arg to dev|prod...
        return environment('prod');

        function environment(env) {
            var defaults = {
                timeout: 20000,
                log: 1,
                redirect_uri: 'http://www.itweb.co.za/mobilesite/'
            };
            return _.assign(defaults, environments[env]);
        }
    }
})();