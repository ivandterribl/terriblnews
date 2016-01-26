(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('PlayController', Controller);

    Controller.$inject = ['api', 'meta', 'moment', '_', '$state', '$sce', '$compile', '$scope', '$ionicScrollDelegate'];
    /* @ngInject */
    function Controller(api, meta, moment, _, $state, $sce, $compile, $scope, $ionicScrollDelegate) {
        var vm = this;

        console.log($state.params);
        vm.v = $state.params.id;
        vm.url = $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + vm.v);

        activate();

        function activate() {
            vm.title = $state.params.title;
            console.log(vm.v);
        }
    }
})();