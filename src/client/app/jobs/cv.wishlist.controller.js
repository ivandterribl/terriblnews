(function() {
    'use strict';

    angular
        .module('itw.jobs')
        .controller('CvWishlistController', Controller);

    Controller.$inject = ['user', 'api2', 'ui', '$q'];
    /* @ngInject */
    function Controller(user, api2, ui, $q) {
        var vm = this;

        vm.next = next;

        activate();

        function activate() {
            var cv = user.profile.careerweb.cv,
                employment = _.first(cv.employment);

            cv = angular.extend(cv, {
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
                jobType: ['Both', 'Permanent', 'Contract']
            };
            vm.employment = angular.extend(employment, {
                RemCurrency: employment.RemCurrency ? employment.RemCurrency : 'ZAR',
                RemFrequencyCode: employment.RemFrequencyCode ? employment.RemFrequencyCode : employment.JobType === 'Contract' ? 'H' : 'M'
            });

            vm.isGraduate = employment.Company === 'New JobSeeker' ? 1 : 0;

            cv.Relocation = vm.lu.relocationList.indexOf(cv.Relocation) === 1 ? true : false;
            cv.SearchableYN = (cv.SearchableYN === 'N' ? false : true);
            vm.cv = cv;

            api2('jobs/lu/currency')
                .then(function(response) {
                    vm.lu.currencyList = response;
                    console.log(response);
                });
        }

        function next() {
            var $valid = 0,
                fields = {
                    cv: ['NoticePeriod', 'WishJobType', 'WishRemAmount', 'WishRemCurrency', 'WishRemFrequencyCode', 'Relocation', 'SearchableYN'],
                    employment: ['RemAmount', 'RemCurrency', 'RemFrequencyCode']
                };

            vm.$submitted = 1;

            if (false && form.$invalid) {
                return;
            }
            var employment = {
                    LoginID: user.profile.careerweb.identifier,
                    EmploymentID: vm.employment.EmploymentID
                },
                cv = {
                    LoginID: user.profile.careerweb.identifier
                };

            angular.forEach(fields.employment, function(key) {
                employment[key] = vm.employment[key];
            });

            angular.forEach(fields.cv, function(key) {
                switch (key) {
                    case 'Relocation':
                        cv[key] = vm.cv[key] ? 'Willing to relocate anywhere' : 'Not willing to relocate'
                        break;
                    case 'SearchableYN':
                        cv[key] = vm.cv[key] ? 'Y' : 'N'
                        break;
                    default:
                        cv[key] = vm.cv[key];
                }
            });

            ui.loading.show();
            var promises = [],
                promise;

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

            $q.all(promises)
                .then(function(response) {
                    console.log('\nwe done :)\n');
                    ui.toast.show('success', 'Your CV is ready')
                    ui.show('app.user.profile');
                });

            console.log(cv, employment);
        }

    }
})();