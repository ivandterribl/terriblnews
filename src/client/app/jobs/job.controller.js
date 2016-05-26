(function() {
    'use strict';

    angular
        .module('itw.jobs')
        .controller('JobController', Controller);

    Controller.$inject = ['api2', '$scope', '$state', '$location'];
    /* @ngInject */
    function Controller(api2, $scope, $state, $location) {

        var vm = this,
            id = $state.params.id,
            limitstart = $state.params.limitstart || 0,
            limit = $state.params.limit || 25;

        activate();

        function activate() {
            vm.analyticsEvent = $location.url();

            vm.job = $state.params.job;
            if (!vm.job) {
                api2('jobs/i/' + $state.params.id)
                    .then(function(response) {
                        vm.job = response;
                        console.log(vm.job);
                    });
            }
        }
    }
})();