(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('meta', Meta);

    Meta.$inject = [];

    function Meta() {
        var description = 'Business Technology News',
            keywords = 'IT, Technology, Business, News',
            canonical = 'http://www.itweb.co.za/';

        return {
            description: function(value) {
                if (value) {
                    description = value;
                }
                return description;
            },
            keywords: function(value) {
                if (value) {
                    keywords = value;
                }
                return keywords;
            },
            canonical: function(value) {
                if (value) {
                    canonical = value;
                }
                return canonical;
            }
        };
    }
})();