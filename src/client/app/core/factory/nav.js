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
                sref: 'app.frontpage'
            }, {
                title: 'News',
                id: 'app.news',
                items: [{
                    title: 'Top news',
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
                    title: 'Analysis'
                }, {
                    title: 'Industry news'
                }, {
                    title: 'Africa'
                }, {
                    title: 'Company news'
                }]

            }, {
                title: 'Opinion',
                items: [{
                    title: 'Columnists'
                }, {
                    title: 'Tech forum'
                }, {
                    title: 'Industry insight'
                }]
            }, {
                title: 'Features'
            }, {
                title: 'CIO zone'
            }, {
                title: 'Surveys'
            }, {
                title: 'Reviews'
            }, {
                title: 'Jobs'
            }, {
                title: 'Companies',
                items: [{
                    title: 'Company news'
                }, {
                    title: 'Virtual press offices'
                }, {
                    title: 'Company zones'
                }, {
                    title: 'Microsites'
                }]
            }, {
                title: 'Video',
                items: []
            }, {
                title: 'Companies',
                items: [{
                    title: 'Company news'
                }, {
                    title: 'Virtual press offices'
                }, {
                    title: 'Company zones'
                }, {
                    title: 'Microsites'
                }]
            }, {
                title: 'Events'
            }, {
                title: 'About',
                items: [{
                    title: 'About us'
                }, {
                    title: 'Contact us'
                }, {
                    title: 'Advertise'
                }, {
                    title: 'Terms of use'
                }, {
                    title: 'Privacy policy'
                }, {
                    title: 'Competition policy'
                }, {
                    title: 'BEE certificate'
                }]
            }]
        }
    }
})();