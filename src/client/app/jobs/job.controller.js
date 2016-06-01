(function() {
    'use strict';

    angular
        .module('itw.jobs')
        .controller('JobController', Controller);

    Controller.$inject = ['api2', '$scope', '$state', '$ionicHistory', 'toastr', '$location', '$auth', 'searchBar'];
    /* @ngInject */
    function Controller(api2, $scope, $state, $ionicHistory, toastr, $location, $auth, searchBar) {

        var vm = this,
            id = $state.params.id,
            limitstart = $state.params.limitstart || 0,
            limit = $state.params.limit || 25;

        vm.showSearchbar = showSearchbar;
        vm.apply = function() {
            if ($auth.isAuthenticated()) {
                alert('Apply ME NiGGa!');
            } else {

                toastr.info('Please login to apply for the position');

                $state.go('app.user.login', {
                    redirect: {
                        name: 'app.jobs.job',
                        params: {
                            id: $state.params.id
                        }
                    }
                });
            }
        }

        activate();

        function activate() {

            vm.analyticsEvent = $location.url();

            vm.job = $state.params.job;
            if (true || !vm.job) {
                api2('jobs/' + $state.params.id)
                    .then(function(response) {
                        vm.job = response;
                        console.log(vm.job);
                    });
            }
        }

        function showSearchbar() {
            searchBar.show({
                stateName: 'app.jobs.search'
            });
        }
    }
})();