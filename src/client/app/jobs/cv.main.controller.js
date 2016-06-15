(function() {
    'use strict';

    angular
        .module('itw.jobs')
        .controller('CvMainController', Controller);

    Controller.$inject = ['user', 'api2', '$state'];
    /* @ngInject */
    function Controller(user, api2, $state) {
        var vm = this;

        vm.next = next;

        activate();

        function activate() {
            vm.cv = user.profile.careerweb;

            vm.lu = {
                genderList: [{
                    value: 'M',
                    text: 'Male'
                }, {
                    value: 'F',
                    text: 'Female'
                }],
                affirmativeList: [{
                    value: 'B',
                    text: 'Black'
                }, {
                    value: 'C',
                    text: 'Colored'
                }, {
                    value: 'A',
                    text: 'Asian'
                }, {
                    value: 'W',
                    text: 'White'
                }],
                jobType: ['Both', 'Permanent', 'Contract']
            };

            api2('jobs/lu/country')
                .then(function(response) {
                    vm.lu.countryList = response;
                });

            api2('jobs/lu/area')
                .then(function(response) {
                    vm.lu.areaList = response;
                });
        }

        function next() {
            var form = vm.cvForm;
            console.log('secure.cv', vm.cv);
            form.$setSubmitted(true);
            if (false && form.$invalid) {
                return;
            }

            $state.go('app.jobs.profile-2');
        }

    }
})();