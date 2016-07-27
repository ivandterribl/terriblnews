(function() {
    'use strict';

    angular
        .module('itw.jobs')
        .controller('JobApplicationsController', Controller);

    Controller.$inject = ['api2', 'user', '$state', '$location', '_'];
    /* @ngInject */
    function Controller(api2, user, $state, $location, _) {
        var vm = this,
            careerweb = user.profile.careerweb;

        activate();

        function activate() {
            vm.analyticsEvent = $location.url();
            vm.applications = careerweb.applications;
        }
    }
})();