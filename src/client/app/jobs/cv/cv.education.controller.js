(function() {
    'use strict';

    angular
        .module('itw.jobs')
        .controller('CvEducationController', Controller);

    Controller.$inject = ['user', 'api2', 'ui', 'moment', '_'];
    /* @ngInject */
    function Controller(user, api2, ui, moment, _) {
        var vm = this,
            careerweb = user.profile.careerweb,
            defaults = {
                education: {
                    Course: null,
                    Institution: null,
                    CompleteDate: null
                }
            };

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
            cv.education = _.map(cv.education, function(row) {
                return angular.extend(row, {
                    CompleteDate: new Date(row.CompleteDate)
                });
            });

            vm.cv = cv;
            if (!vm.cv.education || !vm.cv.education.length) {
                vm.education = angular.copy(defaults.education);
            }
        }

        function add() {
            vm.education = angular.copy(defaults.education);
        }

        function edit(item) {
            vm.education = angular.copy(item);
        }

        function cancel() {
            vm.education = null;
        }

        function isValid(education) {
            var $valid = 1,
                result = [];

            education.$submitted = 1;
            angular.forEach(['Course', 'Institution', 'CompleteDate'], function(input) {
                if (!education[input]) {
                    $valid = 0;
                }
            });
            return $valid;
        }

        function submit(education) {
            if (!isValid(education)) {
                return ui.toast.show('warning', 'Please fill everything in', {
                    timeOut: 5000
                });
            }

            save(education).then(cancel);
        }

        function save(education) {
            var payload = [{
                    'EducationID': education.EducationID,
                    'Course': education.Course,
                    'Institution': education.Institution,
                    'CompleteDate': moment(education.CompleteDate).format()
                }],
                opts = {
                    method: 'POST',
                    data: {
                        LoginID: careerweb.identifier,
                        Education: payload
                    }
                };

            ui.loading.show();
            return api2('jobs/cv/education', opts)
                .then(function(cv) {
                    careerweb.cv.education = _.map(cv.education, function(row) {
                        return angular.extend(row, {
                            CompleteDate: new Date(row.CompleteDate)
                        });
                    });
                    careerweb.cv.LastAccessDate = new Date();
                    return careerweb.cv;

                }).catch(function(response) {
                    ui.toast.show('error', response.error_description);
                }).finally(function() {
                    ui.loading.hide();
                });

        }

        function prev() {
            var education = vm.education;

            if (education) {
                if (!isValid(education)) {
                    return ui.toast.show('warning', 'Please fill everything in', {
                        timeOut: 5000
                    });
                } else {
                    // save pending
                    save(education).then(function() {
                        cancel();
                        ui.show('app.jobs.profile-2');
                    });
                }
            } else {
                ui.show('app.jobs.profile-2');
            }
        }

        function next() {
            var education = vm.education;

            if (education) {
                if (!isValid(education)) {
                    return ui.toast.show('warning', 'Please fill everything in', {
                        timeOut: 5000
                    });
                } else {
                    // save pending
                    save(education).then(function() {
                        cancel();
                        ui.show('app.jobs.profile-4');
                    });
                }
            } else {
                ui.show('app.jobs.profile-4');
            }
        }

        function remove(education) {
            var opts = {
                title: 'Cannot be undone',
                template: 'Are you sure you want to delete ' + education.Course + ' @ ' + education.Institution
            };
            ui.popup.confirm.show(opts)
                .then(function() {
                    ui.loading.show();
                    api2('jobs/cv/education/remove', {
                            method: 'POST',
                            data: {
                                EducationID: education.EducationID
                            }
                        })
                        .then(function(cv) {
                            careerweb.cv.education = cv.education;
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