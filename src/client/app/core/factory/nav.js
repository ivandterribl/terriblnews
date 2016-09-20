(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('nav', Factory);

    Factory.$inject = ['_', '$state'];

    function Factory(_, $state) {
        return {
            get: map
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
                title: 'By category',
                icon: 'ion-document',
                items: [{
                    title: 'Mobile',
                    state: {
                        name: 'app.category',
                        params: {
                            id: 'NxnrQedBWaYL'
                        }
                    }
                }, {
                    title: 'Security',
                    state: {
                        name: 'app.category',
                        params: {
                            id: 'PNeLQOVyWzmJ'
                        }
                    }
                }, {
                    title: 'Financial',
                    state: {
                        name: 'app.category',
                        params: {
                            id: '035X7ALbkRM9'
                        }
                    }
                }, {
                    title: 'ICT and Governance',
                    state: {
                        name: 'app.category',
                        params: {
                            id: 'nRpAWdb3kJ6d'
                        }
                    }
                }, {
                    title: 'Networks',
                    state: {
                        name: 'app.category',
                        params: {
                            id: 'pE327p0j7VDZ'
                        }
                    }
                }, {
                    title: 'Cloud',
                    state: {
                        name: 'app.category',
                        params: {
                            id: 'l5MoWE20Qvmq'
                        }
                    }
                }, {
                    title: 'Enterprise Solutions',
                    state: {
                        name: 'app.category',
                        params: {
                            id: 'NxnrQeO97aYL'
                        }
                    }
                }, {
                    title: 'Business Intelligence',
                    state: {
                        name: 'app.category',
                        params: {
                            id: 'drY17Vny7X8o'
                        }
                    }
                }, {
                    title: 'Business Continuity',
                    state: {
                        name: 'app.category',
                        params: {
                            id: '035X7AXjkRM9'
                        }
                    }
                }, {
                    title: 'Channel',
                    state: {
                        name: 'app.category',
                        params: {
                            id: 'Aqxg7qA47Nwb'
                        }
                    }
                }, {
                    title: 'Unified Communications',
                    state: {
                        name: 'app.category',
                        params: {
                            id: '59l27KyBQoBm'
                        }
                    }
                }, {
                    title: 'e-Commerce',
                    state: {
                        name: 'app.category',
                        params: {
                            id: 'pA69k9eqknd4'
                        }
                    }
                }]
            }, {
                title: 'By location',
                icon: 'ion-location',
                items: [{
                    'title': 'Africa',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'africa'
                        }
                    }
                }, {
                    'title': 'Algeria',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'algeria'
                        }
                    }
                }, {
                    'id': '152',
                    'title': 'Angola',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'angola'
                        }
                    }
                }, {
                    'id': '795',
                    'title': 'Burkina Faso',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'burkina-faso'
                        }
                    }
                }, {
                    'id': '329',
                    'title': 'Congo (DRC)',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'congo-drc'
                        }
                    }
                }, {
                    'id': '156',
                    'title': 'Egypt',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'egypt'
                        }
                    }
                }, {
                    'id': '338',
                    'title': 'Ghana',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'ghana'
                        }
                    }
                }, {
                    'id': '788',
                    'title': 'Ivory Coast',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'ivory-coast'
                        }
                    }
                }, {
                    'id': '153',
                    'title': 'Kenya',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'kenya'
                        }
                    }
                }, {
                    'id': '781',
                    'title': 'Liberia',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'liberia'
                        }
                    }
                }, {
                    'id': '328',
                    'title': 'Malawi',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'malawi'
                        }
                    }
                }, {
                    'id': '330',
                    'title': 'Morocco',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'morocco'
                        }
                    }
                }, {
                    'id': '326',
                    'title': 'Namibia',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'namibia'
                        }
                    }
                }, {
                    'id': '324',
                    'title': 'Nigeria',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'nigeria'
                        }
                    }
                }, {
                    'id': '337',
                    'title': 'Rwanda',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'rwanda'
                        }
                    }
                }, {
                    'id': '531',
                    'title': 'Senegal',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'senegal'
                        }
                    }
                }, {
                    'id': '325',
                    'title': 'South Africa',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'south-africa'
                        }
                    }
                }, {
                    'id': '789',
                    'title': 'Sudan',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'sudan'
                        }
                    }
                }, {
                    'id': '468',
                    'title': 'Swaziland',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'swaziland'
                        }
                    }
                }, {
                    'id': '327',
                    'title': 'Tanzania',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'tanzania'
                        }
                    }
                }, {
                    'id': '527',
                    'title': 'Tunisia',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'tunisia'
                        }
                    }
                }, {
                    'id': '347',
                    'title': 'Uganda',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'uganda'
                        }
                    }
                }, {
                    'id': '155',
                    'title': 'Zambia',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'zambia'
                        }
                    }
                }, {
                    'id': '154',
                    'title': 'Zimbabwe',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'zimbabwe'
                        }
                    }
                }]
            }, {
                title: 'Companies',
                icon: 'ion-cube',
                state: {
                    name: 'app.office'
                }
            }];

        }
    }
})();