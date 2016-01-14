(function() {
    'use strict';

    angular
        .module('app.core')
        .controller('CoreController', Controller);

    Controller.$inject = ['categories'];
    /* @ngInject */
    function Controller(categories) {
        var vm = this;
        vm.categories = categories.get();
        vm.meta = function() {
            return 'Hello';
        };
    }
})();
