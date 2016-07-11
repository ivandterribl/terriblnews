(function() {
    'use strict';

    angular
        .module('itw.user')
        .controller('ProfileController', Controller);

    Controller.$inject = ['$scope', '$auth', 'user', 'ui', '$http', 'toastr', '$ionicHistory', '$timeout'];
    /* @ngInject */
    function Controller($scope, $auth, user, ui, $http, toastr, $ionicHistory, $timeout) {
        var vm = this,
            url = 'https://secure.itweb.co.za/api/';

        vm.link = linkProfile;
        vm.unlink = unlinkProfile;
        vm.logout = logout;
        vm.email = emailActivationCode;

        activate();

        function activate() {
            vm.profile = user.profile;
            vm.cv = user.profile.careerweb.cv;
            completeness();
        }

        function completeness() {
            var percentage = 0;
            percentage += vm.cv.AffirmativeActionCode ? 100 / 6 : 0;
            percentage += vm.cv.skills && vm.cv.skills.length ? 100 / 6 : 0;
            percentage += vm.cv.education && vm.cv.education.length ? 100 / 6 : 0;
            percentage += vm.cv.employment && vm.cv.employment.length ? 100 / 6 : 0;
            percentage += vm.cv.WishRemAmount ? 100 / 6 : 0;
            percentage += vm.cv.document ? 100 / 6 : 0;
            vm.completeness = percentage;
        }

        function emailActivationCode() {
            return $http.get(url + 'accounts/activation')
                .then(function(response) {
                    toastr.info('Verification email sent to ' + response.data.username);
                });
        }

        function getProfile() {
            user.get()
                .then(function() {
                    vm.profile = user.profile;
                });
        }

        function linkProfile(provider) {
            $auth.link(provider)
                .then(function() {
                    toastr.success('You have successfully linked a ' + provider + ' account');
                    getProfile();
                })
                .catch(function(response) {
                    toastr.error(response.data.error_description, response.status);
                });
        }

        function unlinkProfile(provider) {
            $auth.unlink(provider)
                .then(function(response) {
                    toastr.info('You have unlinked a ' + provider + ' account');
                    getProfile();
                })
                .catch(function(response) {
                    toastr.error(response.data ? response.data.error_description : 'Could not unlink ' + provider + ' account', response.status);
                });
        }

        function logout() {
            //ui.loading.show();
            return $auth.logout()
                .finally(function() {
                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    });
                    $state.go('app.frontpage')
                        .then(function() {
                            toastr.info('You have been logged out');
                            $timeout($ionicHistory.clearCache, 351);
                        });

                });
        }
    }
})();