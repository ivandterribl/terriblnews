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
                title: 'Latest news',
                id: 'latestnews'
            }, {
                title: 'Editors pick',
                id: 'topnews'
            }, {
                title: 'Readers\' choice',
                id: 'readerschoice'
            }, {
                title: 'Columnists',
                id: 'columnists'
            }, {
                title: 'Features',
                id: 'features'
            }, {
                title: 'Industry insight',
                id: 'industryinsight'
            }, {
                title: 'Reuters',
                id: 'reutres'
            }, {
                title: 'Company news',
                id: 'vpo'
            }];
        }
    }
})();
