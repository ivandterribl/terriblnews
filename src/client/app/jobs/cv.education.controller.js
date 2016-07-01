(function() {
    'use strict';

    angular
        .module('itw.jobs')
        .controller('CvEducationController', Controller);

    Controller.$inject = ['user', 'api2', 'ui', 'moment', '$ionicPopup', '$scope'];
    /* @ngInject */
    function Controller(user, api2, ui, moment, $ionicPopup, $scope) {
        var vm = this,
            defaults = {
                education: {
                    Course: null,
                    Institution: null,
                    CompleteDate: null
                }
            };

        vm.addItem = addItem;
        vm.removeItem = removeItem;
        vm.next = next;
        vm.showForm = showForm;

        activate();

        function showForm() {
            var myPopup = $ionicPopup.show({
                template: '<input type="password" ng-model="$scope.vm.wifi">',
                title: 'Enter Wi-Fi Password',
                subTitle: 'Please use normal things',
                scope: $scope,
                buttons: [{
                    text: 'Cancel'
                }, {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!vm.wifi) {
                            //don't allow the user to close unless he enters wifi password
                            e.preventDefault();
                        } else {
                            return $scope.data.wifi;
                        }
                    }
                }]
            });
        }

        function activate() {
            vm.cv = user.profile.careerweb.cv;
            vm.education = [];
            if (!vm.cv.education || !vm.cv.education.length) {
                vm.education.push(angular.copy(defaults.education));
            }
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

            if (!form) {
                return ui.show('app.jobs.profile-4');
            }

            form.$setSubmitted(true);
            if (form.$invalid) {
                return;
            }
            var result = [];
            angular.forEach(vm.education, function(row) {
                var o = {
                    'Course': row.Course,
                    'Institution': row.Institution,
                    'CompleteDate': moment(row.CompleteDate).format('YYYYMM')
                };
                result.push(o);
            });

            ui.loading.show();
            api2('jobs/cv/education', {
                method: 'POST',
                data: {
                    CVID: user.profile.careerweb.cv.CVID,
                    LoginID: user.profile.careerweb.identifier,
                    Education: result
                }
            }).then(function(cv) {
                console.log(cv);
                user.profile.careerweb.cv.education = cv.education;
                ui.show('app.jobs.profile-4');
            }).catch(function(response) {
                ui.toast.show('error', response.error_description);
            }).finally(function() {
                ui.loading.hide();
            });
        }

    }
})();