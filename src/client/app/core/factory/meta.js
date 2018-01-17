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
                //this.canonical(opts.canonical);
                this.ld(opts.ld);

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
                return false;
                // var el = document.querySelector('link[rel="canonical"]');
                // if (value || value === false) {
                //     canonical = value;
                //     if (el) {
                //         el.setAttribute('href', value ? value : '');
                //     }
                // }
                // return canonical;
            },
            ld: function(value) {
                var el = document.getElementById('structured-data');
                if (value) {
                    ld = value;
                    if (el) {
                        el.innerText = JSON.stringify(value);
                    }
                } else if (value === false) {
                    if (el) {
                        el.innerText = '';
                    }
                }
                return ld;
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