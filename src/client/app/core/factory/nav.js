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
                    'title': 'Angola',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'angola'
                        }
                    }
                }, {
                    'title': 'Burkina Faso',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'burkina-faso'
                        }
                    }
                }, {
                    'title': 'Congo (DRC)',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'congo-drc'
                        }
                    }
                }, {
                    'title': 'Egypt',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'egypt'
                        }
                    }
                }, {
                    'title': 'Ghana',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'ghana'
                        }
                    }
                }, {
                    'title': 'Ivory Coast',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'ivory-coast'
                        }
                    }
                }, {
                    'title': 'Kenya',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'kenya'
                        }
                    }
                }, {
                    'title': 'Liberia',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'liberia'
                        }
                    }
                }, {
                    'title': 'Malawi',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'malawi'
                        }
                    }
                }, {
                    'title': 'Morocco',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'morocco'
                        }
                    }
                }, {
                    'title': 'Namibia',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'namibia'
                        }
                    }
                }, {
                    'title': 'Nigeria',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'nigeria'
                        }
                    }
                }, {
                    'title': 'Rwanda',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'rwanda'
                        }
                    }
                }, {
                    'title': 'Senegal',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'senegal'
                        }
                    }
                }, {
                    'title': 'South Africa',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'south-africa'
                        }
                    }
                }, {
                    'title': 'Sudan',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'sudan'
                        }
                    }
                }, {
                    'title': 'Swaziland',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'swaziland'
                        }
                    }
                }, {
                    'title': 'Tanzania',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'tanzania'
                        }
                    }
                }, {
                    'title': 'Tunisia',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'tunisia'
                        }
                    }
                }, {
                    'title': 'Uganda',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'uganda'
                        }
                    }
                }, {
                    'title': 'Zambia',
                    'state': {
                        'name': 'app.location',
                        'params': {
                            'id': 'zambia'
                        }
                    }
                }, {
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