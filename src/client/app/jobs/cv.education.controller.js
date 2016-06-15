(function() {
    'use strict';

    angular
        .module('itw.jobs')
        .controller('CvEducationController', Controller);

    Controller.$inject = ['user', 'api2', '$state'];
    /* @ngInject */
    function Controller(user, api2, $state) {
        var vm = this,
            defaults = {
                education: {
                    course: null,
                    institution: null,
                    dateCompleted: null
                }
            };

        vm.addItem = addItem;
        vm.removeItem = removeItem;
        vm.next = next;

        activate();

        function activate() {
            vm.cv = user.profile.careerweb;

            vm.education = [angular.copy(defaults.education)];
        }

        function addItem() {
            var form = vm.cvForm;
            if (form.$invalid) {
                form.$setSubmitted(true);
            } else {
                form.$setPristine(true);
                vm.education.push(angular.copy(defaults.education));
            }
        }

        function removeItem(item) {
            var i = vm.education.indexOf(item);
            if (i !== -1) {
                vm.education.splice(i, 1);
            }
        }

        function next() {
            var form = vm.cvForm;

            form.$setSubmitted(true);
            if (form.$invalid) {
                return;
            }
            console.log('secure.cv.education', vm.education);

            $state.go('app.jobs.profile-4');
        }

    }
})();