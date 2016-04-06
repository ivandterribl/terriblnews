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
                    opts = _.defaults(options || {}, defaults);

                this.title(opts.title);
                this.description(opts.description);
                this.keywords(opts.keywords);
                this.canonical(opts.canonical);
                this.ld(opts.ld);

                return opts;
            },
            description: function(value) {
                if (value || value === false) {
                    description = value;
                    document.querySelector('meta[name="description"]').setAttribute('content', value);
                }
                return description;
            },
            keywords: function(value) {
                if (value || value === false) {
                    keywords = value;
                    document.querySelector('meta[name="keywords"]').setAttribute('content', value);
                    document.querySelector('meta[name="news_keywords"]').setAttribute('content', value);
                }
                return keywords;
            },
            canonical: function(value) {
                if (value || value === false) {
                    canonical = value;
                    document.querySelector('meta[name="canonical"]').setAttribute('content', value ? value : '');
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