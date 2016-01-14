(function() {
    'use strict';

    angular
        .module('app')
        .controller('AppController', Controller);

    Controller.$inject = ['meta'];

    function Controller(meta) {
        this.meta = meta;
    }
})();