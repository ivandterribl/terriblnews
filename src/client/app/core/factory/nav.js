(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('nav', Factory);

    Factory.$inject = [];

    function Factory() {
        return {
            get: get
        };

        function get() {
            return [{
                title: 'Home',
                icon: 'ion-home',
                sref: 'app.frontpage'
            }, {
                title: 'News',
                icon: 'ion-document',
                items: [{
                    title: 'Top news',
                    id: 'topnews',
                    sref: 'app.news.category({ id: \'topnews\' })',
                    items: [{
                        title: 'Business'
                    }, {
                        title: 'Telecoms'
                    }, {
                        title: 'Financial'
                    }, {
                        title: 'Internet'
                    }, {
                        title: 'Security'
                    }, {
                        title: 'Enterprise'
                    }, {
                        title: 'Smart computing'
                    }, {
                        title: 'Networking'
                    }, {
                        title: 'Software'
                    }, {
                        title: 'Hardware'
                    }, {
                        title: 'Channel'
                    }]
                }, {
                    title: 'Analysis',
                    id: 'analysis',
                    sref: 'app.news.category({ id: \'analysis\' })'
                }, {
                    title: 'Industry news',
                    id: 'industry-news',
                    sref: 'app.news.category({ id: \'industry-news\' })'
                }, {
                    title: 'Africa',
                    id: 'africa',
                    sref: 'app.news.category({ id: \'africa\' })'
                }, {
                    title: 'Company news',
                    id: 'vpo',
                    sref: 'app.news.category({ id: \'vpo\' })'
                }]

            }, {
                title: 'Opinion',
                icon: 'ion-quote',
                items: [{
                    title: 'Columnists',
                    id: 'columnists',
                    sref: 'app.opinion.category({ id: \'columnists\' })'
                }, {
                    title: 'Tech forum',
                    id: 'tech-forum',
                    sref: 'app.opinion.category({ id: \'tech-forum\' })'
                }, {
                    title: 'Industry insight',
                    id: 'industryinsight',
                    sref: 'app.opinion.category({ id: \'industryinsight\' })'
                }]
            }, {
                title: 'Features',
                icon: 'ion-pie-graph',
                sref: 'app.404'
            }, {
                title: 'CIO zone',
                icon: 'ion-trophy',
                sref: 'app.404'
            }, {
                title: 'Surveys',
                icon: 'ion-chatboxes',
                sref: 'app.404'
            }, {
                title: 'Reviews',
                icon: 'ion-iphone',
                sref: 'app.404'
            }, {
                title: 'Jobs',
                icon: 'ion-briefcase',
                sref: 'app.404'
            }, {
                title: 'Companies',
                icon: 'ion-cube',
                items: [{
                    title: 'Company news',
                    sref: 'app.404'
                }, {
                    title: 'Virtual press offices',
                    sref: 'app.404'
                }, {
                    title: 'Company zones',
                    sref: 'app.404'
                }, {
                    title: 'Microsites',
                    sref: 'app.404'
                }]
            }, {
                title: 'Video',
                icon: 'ion-videocamera',
                sref: 'app.404'
            }, {
                title: 'Events',
                icon: 'ion-person-stalker',
                sref: 'app.404'
            }, {
                title: 'About',
                icon: 'ion-information',
                items: [{
                    title: 'About us',
                    sref: 'app.404'
                }, {
                    title: 'Contact us',
                    sref: 'app.404'
                }, {
                    title: 'Advertise',
                    sref: 'app.404'
                }, {
                    title: 'Terms of use',
                    sref: 'app.404'
                }, {
                    title: 'Privacy policy',
                    sref: 'app.404'
                }, {
                    title: 'Competition policy',
                    sref: 'app.404'
                }, {
                    title: 'BEE certificate',
                    sref: 'app.404'
                }]
            }];
        }
    }
})();