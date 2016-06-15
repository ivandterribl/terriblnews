(function() {
    'use strict';

    angular
        .module('itw.jobs')
        .controller('CvEmploymentController', Controller);

    Controller.$inject = ['user', 'api2', '$state'];
    /* @ngInject */
    function Controller(user, api2, $state) {
        var vm = this,
            defaults = {
                employment: {
                    CurrentYN: false,
                    $submitted: 0
                }
            };

        vm.next = next;

        vm.addItem = addItem;
        activate();

        function activate() {
            var currentEmployment = angular.extend({}, defaults.employment, {
                CurrentYN: true,
                JobType: 'Permanent'
            });

            vm.cv = user.profile.careerweb;

            vm.lu = {
                jobType: ['Permanent', 'Contract']
            };

            console.log('secure.cv', vm.cv);

            vm.employment = [currentEmployment];

            api2('jobs/lu/industry')
                .then(function(response) {
                    vm.lu.industryList = response;
                });
        }

        function addItem() {
            var $valid = 1,
                employment = _.last(vm.employment);

            employment.$submitted = 1;
            angular.forEach(['Company', 'JobTitle', 'Industry', 'StartDateD', 'Duties'], function(input) {
                if (!employment[input]) {
                    $valid = 0;
                }
            });

            if ($valid) {
                vm.employment.push(angular.copy(defaults.employment));
            }
        }

        function next() {
            var $valid = 1,
                employment = _.last(vm.employment);

            employment.$submitted = 1;
            angular.forEach(['Company', 'JobTitle', 'Industry', 'StartDateD', 'Duties'], function(input) {
                if (!employment[input]) {
                    $valid = 0;
                }
            });

            $state.go('app.jobs.profile-5');
        }

    }
})();