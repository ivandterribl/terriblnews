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
                    id: 'top-news',
                    sref: 'app.news.category({ id: \'top-news\' })',
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
                icon: 'ion-chatbubble',
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
                    id: 'industry-insight',
                    sref: 'app.opinion.category({ id: \'industry-insight\' })'
                }]
            }, {
                title: 'Features',
                icon: 'ion-bookmark',
                id: 'features',
                sref: 'app.features'
            }, {
                title: 'CIO zone',
                icon: 'ion-trophy',
                id: 'cio-zone',
                sref: 'app.cioZone'
            }, {
                title: 'Surveys',
                icon: 'ion-stats-bars',
                id: 'surveys',
                sref: 'app.surveys'
            }, {
                title: 'Reviews',
                icon: 'ion-iphone',
                id: 'reviews',
                sref: 'app.reviews'
            }, {
                title: 'Jobs',
                icon: 'ion-briefcase',
                sref: 'app.jobs'
            }, {
                title: 'Companies',
                icon: 'ion-cube',
                items: [{
                    title: 'Company news',
                    id: 'company-news',
                    sref: 'app.office.news'
                }, {
                    title: 'Virtual press offices',
                    id: 'virtual-press-office',
                    sref: 'app.office.vpo'
                }, {
                    title: 'Company zones',
                    id: 'company-zones',
                    sref: 'app.office.zones'
                }, {
                    title: 'Microsites',
                    id: 'microsites',
                    sref: 'app.office.microsites'
                }]
            }, {
                title: 'Video',
                icon: 'ion-videocamera',
                sref: 'app.video'
            }, {
                title: 'Events',
                icon: 'ion-person-stalker',
                sref: 'app.events'
            }, {
                title: 'About',
                icon: 'ion-information',
                items: [{
                    title: 'About us',
                    sref: 'app.article({ id: 13913 })'
                }, {
                    title: 'Contact us',
                    sref: 'app.article({ id: 27608 })'
                }, {
                    title: 'Advertise',
                    sref: 'app.article({ id: 33679 })'
                }, {
                    title: 'Terms of use',
                    sref: 'app.article({ id: 13913 })'
                }, {
                    title: 'Privacy policy',
                    sref: 'app.article({ id: 38060 })'
                }, {
                    title: 'Competition policy',
                    sref: 'app.article({ id: 48786 })'
                }, {
                    title: 'BEE certificate',
                    sref: 'app.article({ id: 140719 })'
                }]
            }];
        }
    }
})();