(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('categories', Factory);

    Factory.$inject = [];

    function Factory() {
        return {
            get: get
        };

        function get() {
            return [{
                title: 'Top news',
                id: '1'
            }, {
                title: 'Business',
                id: '69'
            }, {
                title: 'Channel',
                id: '77'
            }, {
                title: 'Computing',
                id: '86'
            }, {
                title: 'Enterprise',
                id: '107'
            }, {
                title: 'Financial',
                id: '118'
            }, {
                title: 'Hardware',
                id: '133'
            }, {
                title: 'Internet',
                id: '147'
            }, {
                title: 'Networking',
                id: '198'
            }, {
                title: 'Security',
                id: '234'
            }, {
                title: 'Software',
                id: '250'
            }, {
                title: 'Telecoms',
                id: '260'
            }];
        }
    }
})();