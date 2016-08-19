(function() {
    'use strict';

    angular
        .module('itw.jobs')
        .controller('CvWishlistController', Controller);

    Controller.$inject = ['user', 'api2', 'ui', '$q', '_'];
    /* @ngInject */
    function Controller(user, api2, ui, $q, _) {
        var vm = this,
            careerweb = user.profile.careerweb,
            isNew = false;

        vm.prev = prev;
        vm.next = next;

        activate();

        function activate() {
            var cv = user.profile.careerweb.cv,
                employment = _.first(cv.employment);

            isNew = cv.WishRemAmount ? false : true;
            cv = angular.extend(cv, {
                WishRemAmount: cv.WishRemAmount ? parseFloat(cv.WishRemAmount) : null,
                WishRemCurrency: cv.WishRemCurrency ? cv.WishRemCurrency : 'South African Rands',
                WishRemFrequencyCode: cv.WishRemFrequencyCode ? cv.WishRemFrequencyCode : 'per Month'
            });

            vm.lu = {
                frequencyList: [{
                    key: 'H',
                    value: 'per Hour'
                }, {
                    key: 'D',
                    value: 'per Day'
                }, {
                    key: 'Q',
                    value: 'per Week'
                }, {
                    key: 'M',
                    value: 'per Month'
                }, {
                    key: 'A',
                    value: 'per Annum'
                }],
                noticeList: [{
                    key: '0',
                    value: 'Immediate'
                }, {
                    key: '7',
                    value: '7 Days'
                }, {
                    key: '14',
                    value: '2 Weeks'
                }, {
                    key: '30',
                    value: '1 Month'
                }, {
                    key: '60',
                    value: '2 months'
                }, {
                    key: '90',
                    value: '3 months+'
                }],
                relocationList: [
                    'Not willing to relocate',
                    'Willing to relocate anywhere'
                ],
                jobType: ['Either', 'Permanent', 'Contract']
            };
            vm.employment = angular.extend(employment, {
                RemAmount: employment.RemAmount ? parseFloat(employment.RemAmount) : 0,
                RemCurrency: employment.RemCurrency ? employment.RemCurrency : 'ZAR',
                RemFrequencyCode: employment.RemFrequencyCode ?
                    employment.RemFrequencyCode : employment.JobType === 'Contract' ? 'H' : 'M'
            });

            vm.isGraduate = employment.Company === 'New JobSeeker' || employment.Company === 'New job seeker' ? 1 : 0;

            cv.Relocation = vm.lu.relocationList.indexOf(cv.Relocation) === 1 ? true : false;
            vm.SearchableYN = (cv.SearchableYN === 'N' ? false : true);
            vm.cv = cv;

            api2('jobs/lu/currency')
                .then(function(response) {
                    vm.lu.currencyList = response;
                });
        }

        function prev() {
            var form = vm.cvForm;
            if (vm.cv.WishRemAmount && form.$pristine) {
                return ui.show('app.jobs.profile-4');
            }

            vm.$submitted = 1;

            if (form.$valid) {
                save().then(function() {
                    ui.show('app.jobs.profile-4');
                });
            } else {
                return ui.toast.show('warning', 'Please fill everything in', {
                    timeOut: 5000
                });
            }
        }

        function next() {
            var form = vm.cvForm;
            if (vm.cv.WishRemAmount && form.$pristine) {
                return ui.show('app.user.profile');
            }

            vm.$submitted = 1;

            if (form.$valid) {
                save().then(function() {
                    ui.show('app.user.profile');
                });
            } else {
                return ui.toast.show('warning', 'Please fill everything in', {
                    timeOut: 5000
                });
            }
        }

        function save() {
            var fields = {
                    cv: [
                        'NoticePeriod', 'WishJobType', 'WishRemAmount', 'WishRemCurrency',
                        'WishRemFrequencyCode', 'Relocation', 'SearchableYN'
                    ],
                    employment: ['RemAmount', 'RemCurrency', 'RemFrequencyCode']
                },
                employment = {
                    LoginID: user.profile.careerweb.identifier,
                    EmploymentID: vm.employment.EmploymentID
                },
                cv = {
                    LoginID: user.profile.careerweb.identifier
                },
                promises = [],
                promise;

            angular.forEach(fields.employment, function(key) {
                employment[key] = vm.employment[key];
            });

            angular.forEach(fields.cv, function(key) {
                switch (key) {
                    case 'Relocation':
                        cv[key] = vm.cv[key] ? 'Willing to relocate anywhere' : 'Not willing to relocate';
                        break;
                    case 'SearchableYN':
                        cv[key] = vm[key] ? 'Y' : 'N';
                        break;
                    default:
                        cv[key] = vm.cv[key];
                }
            });

            ui.loading.show();
            promise = api2('jobs/cv/wishlist', {
                method: 'POST',
                data: cv
            });
            promises.push(promise);

            if (!vm.isGraduate) {
                promise = api2('jobs/cv/employment/rem', {
                    method: 'POST',
                    data: employment
                });
                promises.push(promise);
            }

            return $q.all(promises)
                .then(function(response) {
                    careerweb.cv.LastAccessDate = new Date();
                    if (isNew) {
                        ui.toast.show('info', 'What next? Upload your CV in the documents section or apply for a job');
                        ui.toast.show('success', 'Your CV is ready');
                    }
                    return user.get();
                });
        }

    }
})();