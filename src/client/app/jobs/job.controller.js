(function() {
    'use strict';

    angular
        .module('itw.jobs')
        .controller('JobController', Controller);

    Controller.$inject = ['api2', 'response', '$state', '$location', 'user', 'searchBar', 'ui', '_'];
    /* @ngInject */
    function Controller(api2, response, $state, $location, user, searchBar, ui, _) {
        var vm = this,
            jobId = $state.params.id;

        vm.showSearchbar = showSearchbar;
        vm.apply = apply;

        activate();

        function activate() {
            vm.analyticsEvent = $location.url();

            if (!user.$auth.isAuthenticated()) {
                vm.theme = 'bar-energized';
                vm.instruction = 'Login to apply';
            } else if (!user.profile || !user.profile.careerweb || !user.profile.careerweb.cv.CVID) {
                vm.theme = 'bar-energized';
                vm.instruction = 'Create a CV to apply';
            } else {
                vm.theme = 'bar-balanced';
                vm.instruction = 'Apply';
            }

            vm.job = response;
            if (user.$auth.isAuthenticated() && user.profile && user.profile.careerweb) {
                vm.match = _.find(user.profile.careerweb.applications, {
                    uniq: vm.job.uniq
                });
                if (vm.match) {
                    vm.theme = 'bar-royal';
                    vm.match.responseDate = new Date(vm.match.ResponseDate);
                }
            }
        }

        function showSearchbar() {
            searchBar.show({
                stateName: 'app.jobs.search'
            });
        }

        function apply() {
            var params = {
                redirect: {
                    name: 'app.jobs.job',
                    params: {
                        id: jobId
                    }
                }
            };

            if (!user.$auth.isAuthenticated()) {
                $state.go('app.user.login', params);
            } else if (!user.profile || !user.profile.careerweb || !user.profile.careerweb.cv.CVID) {
                $state.go('app.jobs.profile-1', params);
            } else {
                ui.loading.show();
                api2('jobs/applications/' + jobId, {
                        method: 'POST'
                    })
                    .then(function() {
                        user.career.applications()
                            .then(function() {
                                vm.match = _.find(user.profile.careerweb.applications, {
                                    uniq: vm.job.uniq
                                });
                                if (vm.match) {
                                    vm.theme = 'bar-royal';
                                    vm.match.responseDate = new Date(vm.match.ResponseDate);
                                }
                                ui.toast.show('success', 'A job application has been sent on your behalf. Good luck!');
                                vm.job.Stats.JobResponses = vm.job.Stats.JobResponses + 1;
                            })
                            .catch(function() {
                                ui.toast.show('error', 'Oops, something went wrong');
                            })
                            .finally(function() {
                                ui.loading.hide();
                            });

                    })
                    .catch(function(response) {
                        // Your current employment history details are incomplete. A job application cannot be sent.
                        // The personal details section on your CV contains incomplete information.
                        // A job application cannot be sent.
                        // You have already sent through an application for this job.
                        ui.toast.show('error', response.error_description);
                        ui.loading.hide();
                    });
            }
        }
    }
})();