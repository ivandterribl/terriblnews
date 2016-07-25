(function() {
    'use strict';

    angular
        .module('itw.jobs')
        .controller('JobApplicationsController', Controller);

    Controller.$inject = ['api2', 'user', '$state', '$scope', '_'];
    /* @ngInject */
    function Controller(api2, user, $state, searchBar, _) {
        var vm = this,
            careerweb = user.profile.careerweb;

        activate();

        function activate() {
            vm.applications = careerweb.applications;
            console.log('applications', vm.applications);
        }

        function loadItems() {
            api2('jobs/search?q=' + encodeURIComponent(vm.q) + '&limitstart=' + limitstart)
                .then(function(response) {

                    $scope.$broadcast('scroll.infiniteScrollComplete');

                    limitstart += response.items.length;
                    vm.complete = limitstart >= vm.pagination.total ? 1 : 0;
                })
                .catch(function() {
                    vm.items = [];
                    vm.complete = 1;
                })
                .finally(function() {
                    vm.loading = 0;
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }
    }
})();