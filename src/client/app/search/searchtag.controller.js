(function() {
    'use strict';

    angular
        .module('app.search')
        .controller('SearchTagController', Controller);

    Controller.$inject = ['response', '$state'];
    /* @ngInject */
    function Controller(response, $state) {
        var vm = this;

        activate();

        function activate() {
            vm.q = $state.params.q;
            vm.items = response;
            vm.loading = 0;
        }
    }
})();