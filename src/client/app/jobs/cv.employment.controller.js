(function() {
    'use strict';

    angular
        .module('itw.jobs')
        .controller('CvEmploymentController', Controller);

    Controller.$inject = ['user', 'api2', 'ui'];
    /* @ngInject */
    function Controller(user, api2, ui) {
        var vm = this,
            defaults = {
                employment: {
                    CurrentYN: false,
                    $submitted: 0
                }
            };

        vm.skip = skip;
        vm.next = next;

        vm.addItem = addItem;
        vm.removeItem = removeItem;
        activate();

        function activate() {
            var currentEmployment = angular.extend({}, defaults.employment, {
                CurrentYN: true,
                JobType: 'Permanent'
            });

            vm.cv = user.profile.careerweb.cv;
            vm.cv.employment = _.map(vm.cv.employment, function(row) {
                return angular.extend(row, {
                    StartDateD: new Date(row.StartDateD),
                    EndDateD: new Date(row.EndDateD)
                });
            });

            vm.lu = {
                jobType: ['Permanent', 'Contract']
            };

            console.log('secure.cv', vm.cv);
            vm.employment = []
            if (!vm.cv.employment.length) {
                vm.employment.push(currentEmployment);
            }
            vm.isGraduate = vm.cv.employment.length && vm.cv.employment[0].Company === 'New JobSeeker' ? 1 : 0;

            api2('jobs/lu/industry')
                .then(function(response) {
                    vm.lu.industryList = response;
                });
        }

        function isValid() {
            var $valid = 1,
                employment = _.last(vm.employment),
                result = [];

            employment.$submitted = 1;
            angular.forEach(['Company', 'JobTitle', 'Industry', 'StartDateD', 'Duties'], function(input) {
                if (!employment[input]) {
                    $valid = 0;
                }
            });
            return $valid;
        }

        function removeItem(item) {
            var i = vm.employment.indexOf(item);
            if (i !== -1) {
                vm.employment.splice(i, 1);
            }
        }

        function addItem() {
            if (isValid()) {
                vm.employment.push(angular.copy(defaults.employment));
            }
        }

        function next() {
            var payload = [];
            if (!vm.employment.length) {
                return ui.show('app.jobs.profile-5');
            } else if (isValid()) {
                angular.forEach(vm.employment, function(row) {
                    var o = {
                        'Company': row.Company,
                        'JobTitle': row.JobTitle,
                        'Industry': row.Industry,
                        'StartDateD': row.StartDateD,
                        'EndDateD': row.EndDateD,
                        'CurrentYN': row.CurrentYN ? 'Y' : 'N',
                        'Duties': row.Duties,
                        'JobType': row.JobType
                    };
                    payload.push(o);
                });

                ui.loading.show();
                api2('jobs/cv/employment', {
                    method: 'POST',
                    data: {
                        CVID: user.profile.careerweb.cv.CVID,
                        LoginID: user.profile.careerweb.identifier,
                        Employment: payload
                    }
                }).then(function(cv) {
                    console.log(cv);
                    user.profile.careerweb.cv.employment = cv.employment;
                    ui.show('app.jobs.profile-5');
                }).catch(function(response) {
                    ui.toast.show('error', response.error_description);
                }).finally(function() {
                    ui.loading.hide();
                });
            }
        }

        function skip() {
            api2('jobs/cv/employment/new', {
                method: 'POST',
                data: {
                    CVID: user.profile.careerweb.cv.CVID,
                    LoginID: user.profile.careerweb.identifier
                }
            }).then(function(cv) {
                user.profile.careerweb.cv.employment = cv.employment;
                ui.show('app.jobs.profile-5');
            }).catch(function(response) {
                ui.toast.show('error', response.error_description);
            });
        }

    }
})();