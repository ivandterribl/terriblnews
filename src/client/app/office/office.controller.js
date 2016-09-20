(function() {
    'use strict';

    angular
        .module('app.office')
        .controller('OfficeController', Controller);

    Controller.$inject = ['response', '$scope', '$state', '$location'];
    /* @ngInject */
    function Controller(response, $scope, $state, $location) {
        var vm = this;

        vm.eventLabel = eventLabel;

        activate();

        function eventLabel() {
            return $location.url();
        }

        function activate() {
            vm.items = response;

        }
    }
})();