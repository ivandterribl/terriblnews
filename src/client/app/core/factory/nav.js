(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('nav', Factory);

    Factory.$inject = ['_', '$state'];

    function Factory(_, $state) {
        return {
            get: map,
            export: routes
        };

        function map() {
            var groups = get();
            angular.forEach(groups, traverse);
            return groups;

            function traverse(item) {
                angular.forEach(item.items || [], traverse);
                if (angular.isObject(item.state)) {
                    item.href = $state.href(item.state.name, item.state.params);
                }
            }

        }

        function get() {
            return [{
                title: 'Home',
                icon: 'ion-home',
                state: {
                    name: 'app.frontpage'
                }
            }, {
                title: 'News',
                icon: 'ion-document',
                items: [{
                    title: 'Top stories',
                    id: 'top-news',
                    state: {
                        name: 'app.news.category',
                        params: {
                            id: 'top-news'
                        }
                    }
                }, {
                    title: 'Industry news',
                    id: 'industry-news',
                    state: {
                        name: 'app.news.category',
                        params: {
                            id: 'industry-news'
                        }
                    }
                }, {
                    title: 'Company news',
                    id: 'company-news',
                    state: {
                        name: 'app.news.category',
                        params: {
                            id: 'company-news'
                        }
                    }
                }, {
                    title: 'Africa',
                    id: 'africa',
                    state: {
                        name: 'app.news.category',
                        params: {
                            id: 'africa'
                        }
                    }
                }, {
                    title: 'World',
                    id: 'world',
                    state: {
                        name: 'app.news.category',
                        params: {
                            id: 'world'
                        }
                    }
                }]
            }, {
                title: 'Opinion',
                icon: 'ion-chatbubble',
                items: [{
                    title: 'Columnists',
                    id: 'columnists',
                    state: {
                        name: 'app.opinion.category',
                        params: {
                            id: 'columnists'
                        }
                    }
                }, {
                    title: 'Tech forum',
                    id: 'tech-forum',
                    state: {
                        name: 'app.opinion.category',
                        params: {
                            id: 'tech-forum'
                        }
                    }
                }, {
                    title: 'Industry insight',
                    id: 'industry-insight',
                    state: {
                        name: 'app.opinion.category',
                        params: {
                            id: 'industry-insight'
                        }
                    }
                }]
            }, {
                title: 'Features',
                icon: 'ion-bookmark',
                id: 'features',
                sref: 'app.section({ id: 116 })',
                state: {
                    name: 'app.section',
                    params: {
                        id: 116
                    }
                }
            }, {
                title: 'CIO zone',
                icon: 'ion-trophy',
                id: 'cio-zone',
                sref: 'app.section({ id: 869 })',
                state: {
                    name: 'app.section',
                    params: {
                        id: 869
                    }
                }
            }, {
                title: 'Reviews',
                icon: 'ion-iphone',
                id: 'reviews',
                sref: 'app.section({ id: 220 })',
                state: {
                    name: 'app.section',
                    params: {
                        id: 220
                    }
                }
            }, {
                title: 'Companies',
                icon: 'ion-cube',
                items: [{
                    title: 'Virtual press offices',
                    id: 'virtual-press-office',
                    state: {
                        name: 'app.office.vpo'
                    }
                }, {
                    title: 'Company zones',
                    id: 'company-zones',
                    state: {
                        name: 'app.office.zones'
                    }
                }, {
                    title: 'Microsites',
                    id: 'microsites',
                    state: {
                        name: 'app.office.microsites'
                    }
                }]
            }, {
                title: 'Jobs',
                icon: 'ion-briefcase',
                items: [{
                    title: 'IT',
                    id: 'it,sect_id-1',
                    state: {
                        name: 'app.jobs.feed',
                        params: {
                            id: 'it,sect_id-1'
                        }
                    }
                }, {
                    title: 'Financial',
                    id: 'financial,sect_id-2',
                    state: {
                        name: 'app.jobs.feed',
                        params: {
                            id: 'financial,sect_id-2'
                        }
                    }
                }, {
                    title: 'Engineering',
                    id: 'engineering,sect_id-3',
                    state: {
                        name: 'app.jobs.feed',
                        params: {
                            id: 'engineering,sect_id-3'
                        }
                    }
                }, {
                    title: 'Sales',
                    id: 'sales,sect_id-4',
                    state: {
                        name: 'app.jobs.feed',
                        params: {
                            id: 'sales,sect_id-4'
                        }
                    }
                }]
            }, {
                title: 'Events',
                icon: 'ion-person-stalker',
                state: {
                    name: 'app.events'
                }
            }, {
                title: 'About',
                icon: 'ion-information',
                items: [{
                    title: 'About us',
                    state: {
                        name: 'app.about.us'
                    }
                }, {
                    title: 'Contact us',
                    state: {
                        name: 'app.about.contact'
                    }
                }, {
                    title: 'Privacy policy',
                    state: {
                        name: 'app.about.privacy'
                    }
                }, {
                    title: 'Competition policy',
                    state: {
                        name: 'app.about.competition'
                    }
                }, {
                    title: 'BEE certificate',
                    state: {
                        name: 'app.about.bee'
                    }
                }]
            }];
        }

        function routes() {
            return [];
            //var result = _.map(this.get(), transform);
            //return result;
            //
            //function transform(row) {
            //    var a = row.sref && row.sref.indexOf('(') > -1 ? row.sref.replace(')', '').split('(') : null;
            //
            //    return {
            //        title: row.title,
            //        icon: row.icon,
            //        url: a && a[1] ? $state.href(a[0], {
            //            id: row.id
            //        }) : $state.href(row.sref),
            //        items: _.map(row.items || [], transform)
            //    };
            //}
        }
    }
})();