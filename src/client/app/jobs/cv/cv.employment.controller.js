(function() {
    'use strict';

    angular
        .module('itw.jobs')
        .controller('CvEmploymentController', Controller);

    Controller.$inject = ['user', 'api2', 'ui', 'moment', '_'];
    /* @ngInject */
    function Controller(user, api2, ui, moment, _) {
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
        vm.remove = remove;

        activate();

        function activate() {

            var cv = careerweb.cv;

            vm.isGraduate = _.find(cv.employment, {
                Company: 'New JobSeeker'
            });

            cv.employment = _.map(cv.employment, function(row) {
                return angular.extend(row, {
                    Company: row.Company === 'New JobSeeker' ? 'New job seeker' : row.Company,
                    JobTitle: row.Company === 'New JobSeeker' ? 'Seeking 1st time employment' : row.JobTitle,
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
            } else {
                vm.employment = null;
            }

            // lookups
            if (!vm.lu) {
                vm.lu = {
                    jobType: ['Permanent', 'Contract']
                };
                api2('jobs/lu/industry')
                    .then(function(response) {
                        vm.lu.industryList = response;
                    });
            }
        }

        function skip() {
            api2('jobs/cv/employment/new', {
                method: 'POST',
                data: {
                    CVID: careerweb.cv.CVID,
                    LoginID: careerweb.identifier
                }
            }).then(function(cv) {
                careerweb.cv.employment = cv.employment;
                careerweb.cv.LastAccessDate = new Date();
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
            activate();
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
                return ui.toast.show('warning', 'Please fill everything in', {
                    timeOut: 5000
                });
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
                    careerweb.cv.employment = cv.employment;
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
                    return ui.toast.show('warning', 'Please fill everything in', {
                        timeOut: 5000
                    });
                } else {
                    // save pending
                    save(employment).then(function() {
                        //cancel();
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
                    return ui.toast.show('warning', 'Please fill everything in', {
                        timeOut: 5000
                    });
                } else {
                    // save pending
                    save(employment).then(function() {
                        //cancel();
                        ui.show('app.jobs.profile-5');
                    });
                }
            } else {
                ui.show('app.jobs.profile-5');
            }
        }

        function remove(employment) {
            var opts = {
                title: 'Cannot be undone',
                template: 'Are you sure you want to delete ' + employment.JobTitle + ' @ ' + employment.Company
            };
            ui.popup.confirm.show(opts)
                .then(function() {
                    ui.loading.show();
                    api2('jobs/cv/employment/remove', {
                            method: 'POST',
                            data: {
                                EmploymentID: employment.EmploymentID
                            }
                        })
                        .then(function(cv) {
                            careerweb.cv.employment = cv.employment;
                            cancel();
                        })
                        .catch(function(response) {
                            ui.toast.show('error', response.error_description);
                        })
                        .finally(function() {
                            ui.loading.hide();
                        });
                });
        }

    }
})();