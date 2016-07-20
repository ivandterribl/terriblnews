(function() {
    'use strict';

    angular
        .module('itw.jobs')
        .controller('CvDocumentsController', Controller);

    Controller.$inject = ['user', 'api2', 'ui', '$interval', '$q', '$scope', 'Upload'];
    /* @ngInject */
    function Controller(user, api2, ui, $interval, $q, $scope, Upload) {
        var vm = this,
            careerweb = user.profile.careerweb;

        vm.prev = prev;
        vm.next = next;

        activate();

        function activate() {
            vm.cv = careerweb.cv;
        }

        function prev() {
            if (vm.document) {
                save().then(function() {
                    ui.show('app.jobs.profile-5');
                });
            } else {
                ui.show('app.jobs.profile-5');
            }
        }

        function next() {
            if (vm.document) {
                save().then(function() {
                    ui.show('app.jobs.tabs.feed', {
                        id: 'it,sect_id-1'
                    });
                });
            } else {
                ui.show('app.jobs.tabs.feed', {
                    id: 'it,sect_id-1'
                });
            }
        }

        function save() {
            var deferred = $q.defer();
            ui.loading.show();

            Upload.upload({
                url: 'https://secure.itweb.co.za/api/jobs/cv/upload',
                data: {
                    LoginID: careerweb.identifier,
                    file: vm.document
                }
            }).then(function(response) {
                var cv = response.data;
                ui.toast.show('success', 'Document uploaded');

                vm.progress = 0;
                vm.document = null;
                careerweb.cv.document = cv.document;

                deferred.resolve(cv.document);
            }, function(response) {
                var errorMessage = response && response.data && response.data.error_description ?
                    response.data.error_description : 'Upload failed';
                ui.toast.show('error', errorMessage);
                vm.progress = 0;
                deferred.reject(response);
            }, function(evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                vm.progress = progressPercentage;
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);

            }).finally(function() {

                ui.loading.hide();
            });

            return deferred.promise;
        }
    }
})();