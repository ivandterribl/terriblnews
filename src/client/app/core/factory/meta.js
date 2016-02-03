(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('meta', Meta);

    Meta.$inject = [];

    function Meta() {
        var description = 'Business Technology News',
            keywords = 'IT, Technology, Business, News',
            canonical = 'http://www.itweb.co.za/',
            ld;

        return {
            description: function(value) {
                if (value || value === false) {
                    description = value;
                }
                return description;
            },
            keywords: function(value) {
                if (value || value === false) {
                    keywords = value;
                }
                return keywords;
            },
            canonical: function(value) {
                if (value || value === false) {
                    canonical = value;
                }
                return canonical;
            },
            ld: function(value) {
                if (value || value === false) {
                    ld = value;
                }
                if (value) {
                    document.getElementById('json-ld').innerText = JSON.stringify(value);
                }
                return ld;
            }
        };
    }
})();