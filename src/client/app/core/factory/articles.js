(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('articles', Factory);

    Factory.$inject = ['_'];

    function Factory(_) {
        var cache = [];
        return {
            get: function(params) {
                return params ? _.findWhere(cache, params) : cache;
            },
            set: function(items) {
                cache = items;
            },
            push: function(items) {
                cache = cache.concat(items);
            },
            len: function() {
                return cache.length;
            },
            indexOf: function(params) {
                return params ? _.findIndex(cache, params) : -1;
            },
            prev: function(params) {
                var i = this.indexOf(params);

                return (i > 0) ? cache[i - 1] : null;
            },
            next: function(params) {
                var len = this.len(),
                    i = this.indexOf(params);

                return (i < len) ? cache[i + 1] : null;
            }
        };
    }
})();