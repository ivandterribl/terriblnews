(function() {
    'use strict';

    angular
        .module('itw.jobs')
        .controller('CvMainController', Controller);

    Controller.$inject = ['user', 'api2', '$state', 'ui'];
    /* @ngInject */
    function Controller(user, api2, $state, ui) {
        var vm = this;

        vm.next = next;

        activate();

        function activate() {
            var cv = user.profile.careerweb.cv;
            //ui.toast.show('info', 'Fill everything in and tap Next once done');
            vm.cv = {
                FirstName: cv.FirstName,
                Surname: cv.Surname,
                EmailAddress: cv.EmailAddress,
                PrefContactNo: cv.PrefContactNo,
                OthContactNo: cv.OthContactNo,
                YearofBirth: cv.YearofBirth,
                YearsExperience: cv.YearsExperience,
                Gender: cv.Gender,
                Race: cv.Race,
                PhysicallyDisabled: cv.PhysicallyDisabled || false,
                BirthCountry: cv.BirthCountry,
                ResCountry: cv.ResCountry,
                ResCity: cv.ResCity
            };

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
                jobType: ['Both', 'Permanent', 'Contract'],
                birthYear: [],
                yearsExperience: []
            };

            var y = new Date().getYear() + 1900 - 13,
                i = 0;
            for (i = 0; i < 72; i++) {
                vm.lu.birthYear.push(String(y - i));
            }

            for (i = 0; i < 66; i++) {
                vm.lu.yearsExperience.push(String(i));
            }

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
            if (vm.cv.Gender && vm.cv.Race && form.$pristine) {
                return ui.show('app.jobs.profile-2');
            }

            form.$setSubmitted(true);
            if (form.$invalid) {
                return ui.toast.show('warning', 'Please fill everything in');
            }

            ui.loading.show();
            api2('jobs/cv/main', {
                method: 'POST',
                data: angular.extend({
                    LoginID: user.profile.careerweb.identifier
                }, vm.cv)
            }).then(function(cv) {
                if (cv && cv.AffirmativeActionCode) {
                    cv.Gender = cv.AffirmativeActionCode.indexOf('M') === -1 ? 'F' : 'M';
                    cv.Race = cv.AffirmativeActionCode[0];
                    cv.PhysicallyDisabled = cv.AffirmativeActionCode.indexOf('D') !== -1 ? true : false;
                }
                user.profile.careerweb.cv = cv;
                ui.show('app.jobs.profile-2');
            }).catch(function(response) {
                ui.toast.show('error', response.error_description);
            }).finally(function() {
                ui.loading.hide();
            });
        }

    }
})();