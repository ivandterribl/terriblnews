(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('meta', Meta);

    Meta.$inject = ['_'];

    function Meta(_) {
        var description = 'Business Technology News',
            keywords = 'ITWeb, africa, ICT, telecoms, mobile, news',
            canonical = 'http://www.itwebafrica.com/',
            ld;

        return {
            set: function(options) {
                var defaults = {
                        title: 'Business Technology News',
                        description: [
                            'ITWeb Africa provides the latest news, analysis, features, market and video reports, ',
                            'and insights into the continent’s changing telecoms and technology industry ',
                            'to help those in the continent’s ICT industry stay in the loop.'
                        ].join(''),
                        keywords: 'ITWeb, africa, ICT, telecoms, mobile, news',
                        canonical: false,
                        ld: false
                    },
                    opts = _.defaults(options || {}, defaults);

                this.title(opts.title);
                this.description(opts.description);
                this.keywords(opts.keywords);
                this.canonical(opts.canonical);

                return opts;
            },
            description: function(value) {
                var el = document.querySelector('meta[name="description"]');
                if (value || value === false) {
                    description = value;
                    if (el) {
                        el.setAttribute('content', value);
                    }
                }
                return description;
            },
            keywords: function(value) {
                var el;
                if (value || value === false) {
                    keywords = value;
                    el = document.querySelector('meta[name="keywords"]');
                    if (el) {
                        el.setAttribute('content', value);
                    }
                    el = document.querySelector('meta[name="news_keywords"]');
                    if (el) {
                        el.setAttribute('content', value);
                    }
                }
                return keywords;
            },
            canonical: function(value) {
                var el = document.querySelector('meta[name="canonical"]');
                if (value || value === false) {
                    canonical = value;
                    if (el) {
                        el.setAttribute('content', value ? value : '');
                    }
                }
                return canonical;
            },
            title: function(value) {
                var el = document.getElementsByTagName('title');
                if (_.isString(value) && el && el.length) {
                    el[0].innerText = [value, 'ITWeb'].join(' | ');
                }
            }
        };
    }
})();