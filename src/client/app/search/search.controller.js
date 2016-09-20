(function() {
    'use strict';

    angular
        .module('app.search')
        .controller('SearchController', Controller);

    Controller.$inject = ['response', '$state', 'searchBar', 'searchBarConfig', '$ionicConfig', '$ionicHistory'];
    /* @ngInject */
    function Controller(response, $state, searchBar, searchBarConfig, $ionicConfig, $ionicHistory) {
        var vm = this;

        activate();

        function activate() {
            vm.q = $state.params.q;
            vm.items = response;
            vm.loading = 0;
        }
    }
})();