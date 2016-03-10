(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('meta', Meta);

    Meta.$inject = ['_'];

    function Meta(_) {
        var description = 'Business Technology News',
            keywords = 'IT, Technology, Business, News',
            canonical = 'http://www.itweb.co.za/',
            ld;

        return {
            set: function(options) {
                var defaults = {
                        title: 'Business Technology News and Information Site',
                        description: [
                            'Daily technology news portal, ',
                            'recognised as the most trusted voice in South African IT publishing, ',
                            'and is the first port of call for an audience that ranges ',
                            'from technology professionals to CEOs.'
                        ].join(''),
                        keywords: 'IT, Technology, Business, News',
                        canonical: false,
                        ld: false
                    },
                    opts = _.assign(defaults, _.compact(options));

                this.title(opts.title);
                this.description(opts.description);
                this.keywords(opts.keywords);
                this.canonical(opts.canonical);
                this.ld(opts.ld);
            },
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
                if (value) {
                    document.getElementById('structured-data').innerText = JSON.stringify(value);
                } else if (value === false) {
                    document.getElementById('structured-data').innerText = '';
                }
                return ld;
            },
            title: function(value) {
                if (_.isString(value)) {
                    document.getElementsByTagName('title')[0].innerText = [value, 'ITWeb'].join(' | ');
                }
            }
        };
    }
})();
