(function() {
    'use strict';

    angular
        .module('itw.jobs')
        .controller('CvEmploymentController', Controller);

    Controller.$inject = ['user', 'api2', 'ui'];
    /* @ngInject */
    function Controller(user, api2, ui) {
        var vm = this,
            careerweb = user.profile.careerweb,
            defaults = {
                employment: {
                    CurrentYN: false,
                    JobType: 'Permanent',
                    $submitted: 0
                }
            };

        vm.skip = skip;
        vm.addItem = add;
        vm.edit = edit;
        vm.cancel = cancel;
        vm.next = next;
        vm.prev = prev;
        vm.submit = submit;

        activate();

        function activate() {
            var cv = careerweb.cv;

            cv.employment = _.map(cv.employment, function(row) {
                return angular.extend(row, {
                    CurrentYN: row.CurrentYN === 'Y' ? true : false,
                    StartDateD: new Date(row.StartDateD),
                    EndDateD: row.EndDateD ? new Date(row.EndDateD) : null
                });
            });

            vm.cv = cv;
            if (!vm.cv.employment || !vm.cv.employment.length) {
                vm.employment = angular.extend({}, defaults.employment, {
                    CurrentYN: true
                });
            }

            vm.isGraduate = vm.cv.employment.length && vm.cv.employment[0].Company === 'New JobSeeker' ? 1 : 0;

            // lookups
            vm.lu = {
                jobType: ['Permanent', 'Contract']
            };
            api2('jobs/lu/industry')
                .then(function(response) {
                    vm.lu.industryList = response;
                });
        }

        function skip() {
            api2('jobs/cv/employment/new', {
                method: 'POST',
                data: {
                    CVID: careerweb.cv.CVID,
                    LoginID: careerweb.identifier
                }
            }).then(function(cv) {
                careerweb.cv.employment = _.map(cv.employment, function(row) {
                    return angular.extend(row, {
                        CurrentYN: row.CurrentYN === 'Y' ? true : false,
                        StartDateD: new Date(row.StartDateD),
                        EndDateD: row.EndDateD ? new Date(row.EndDateD) : null
                    });
                });
                ui.show('app.jobs.profile-5');
            }).catch(function(response) {
                ui.toast.show('error', response.error_description);
            });
        }

        function add() {
            vm.employment = angular.copy(defaults.employment);
        }

        function edit(item) {
            vm.employment = angular.copy(item);
        }

        function cancel() {
            vm.employment = null;
        }

        function isValid(employment) {
            var $valid = 1,
                result = [];

            employment.$submitted = 1;
            angular.forEach(['Company', 'JobTitle', 'Industry', 'StartDateD', 'Duties'], function(input) {
                if (!employment[input]) {
                    $valid = 0;
                }
            });
            if (!employment.CurrentYN && !employment.EndDateD) {
                $valid = 0;
            }
            return $valid;
        }

        function submit(employment) {
            if (!isValid(employment)) {
                return;
            }

            save(employment).then(cancel);
        }

        function save(employment) {
            var payload = {
                'EmploymentID': employment.EmploymentID,
                'Company': employment.Company,
                'JobTitle': employment.JobTitle,
                'Industry': employment.Industry,
                'StartDateD': moment(employment.StartDateD).format(),
                'EndDateD': !employment.CurrentYN ? moment(employment.EndDateD).format() : null,
                'CurrentYN': employment.CurrentYN ? 'Y' : 'N',
                'Duties': employment.Duties,
                'JobType': employment.JobType
            };

            ui.loading.show();
            return api2('jobs/cv/employment', {
                    method: 'POST',
                    data: {
                        LoginID: careerweb.identifier,
                        Employment: [payload]
                    }
                })
                .then(function(cv) {
                    careerweb.cv.employment = _.map(cv.employment, function(row) {
                        return angular.extend(row, {
                            CurrentYN: row.CurrentYN === 'Y' ? true : false,
                            StartDateD: new Date(row.StartDateD),
                            EndDateD: row.EndDateD ? new Date(row.EndDateD) : null
                        });
                    })
                    return careerweb.cv;
                })
                .catch(function(response) {
                    ui.toast.show('error', response.error_description);
                })
                .finally(function() {
                    ui.loading.hide();
                });

        }

        function prev() {
            var employment = vm.employment;

            if (employment) {
                if (!isValid(employment)) {
                    return;
                } else {
                    // save pending
                    save(employment).then(function() {
                        cancel();
                        ui.show('app.jobs.profile-3');
                    });
                }
            } else {
                ui.show('app.jobs.profile-3');
            }
        }

        function next() {
            var employment = vm.employment;

            if (employment) {
                if (!isValid(employment)) {
                    return;
                } else {
                    // save pending
                    save(employment).then(function() {
                        cancel();
                        ui.show('app.jobs.profile-5');
                    });
                }
            } else {
                ui.show('app.jobs.profile-5');
            }
        }

        function old_next() {
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
                        CVID: careerweb.cv.CVID,
                        LoginID: careerweb.identifier,
                        Employment: payload
                    }
                }).then(function(cv) {
                    console.log(cv);
                    careerweb.cv.employment = cv.employment;
                    ui.show('app.jobs.profile-5');
                }).catch(function(response) {
                    ui.toast.show('error', response.error_description);
                }).finally(function() {
                    ui.loading.hide();
                });
            }
        }

    }
})();