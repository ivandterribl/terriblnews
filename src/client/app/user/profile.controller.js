(function() {
    'use strict';

    angular
        .module('itw.user')
        .controller('ProfileController', Controller);

    Controller.$inject = ['$auth', 'api2', 'user', 'ui', '$location', '$ionicHistory', '$timeout', 'moment'];
    /* @ngInject */
    function Controller($auth, api2, user, ui, $location, $ionicHistory, $timeout, moment) {
        var vm = this;

        vm.link = linkProfile;
        vm.logout = logout;
        vm.email = emailActivationCode;
        vm.refresh = refresh;
        vm.searchable = searchable;
        vm.newsletter = newsletter;

        activate();

        function activate() {
            vm.analyticsEvent = $location.url();

            vm.profile = user.profile;
            vm.cv = user.profile.careerweb.cv;
            vm.cv.outdated = vm.cv.LastAccessDate && moment().diff(vm.cv.LastAccessDate, 'months') >= 3 ? 1 : 0;

            completeness();

            vm.notifications = {
                newsletter: false
            };
            notifications();
        }

        function notifications() {
            api2('jobs/cv/notifications')
                .then(function(response) {
                    if (response && response.Subscribed === 'Y') {
                        vm.notifications.newsletter = true;
                    }
                });
        }

        function newsletter() {
            ui.loading.show();
            var opts = {
                method: 'POST',
                data: {
                    Subscribed: vm.notifications.newsletter ? 'Y' : 'N'
                }
            };
            ui.loading.show();
            api2('jobs/cv/notifications', opts)
                .then(function(response) {
                    if (response && response.Subscribed === 'Y') {
                        ui.toast.show('success', 'Thank you, look out for us in your inbox');
                        vm.notifications.newsletter = true;
                    } else {
                        ui.toast.show('success', 'Done, you have opted out of our newsletter');
                        vm.notifications.newsletter = false;
                    }
                })
                .finally(function() {
                    ui.loading.hide();
                });

        }

        function refresh() {
            ui.loading.show();
            api2('jobs/cv/refresh')
                .then(function() {
                    vm.cv.LastAccessDate = new Date();
                    vm.cv.outdated = 0;
                    ui.toast.show('success', 'Thank you for letting us know and good luck!');
                })
                .finally(function() {
                    ui.loading.hide();
                });

        }

        function searchable() {
            var opts = {
                method: 'POST',
                data: {
                    SearchableYN: 'N'
                }
            };
            ui.loading.show();
            api2('jobs/cv/searchable', opts)
                .then(function() {
                    ui.toast.show('success', 'Your CV is now private, you can change this in the Wishlist & Settings section');
                    getProfile();
                })
                .finally(function() {
                    ui.loading.hide();
                });

        }

        function completeness() {
            var percentage = 0;
            percentage += vm.cv.AffirmativeActionCode ? 100 / 6 : 0;
            percentage += vm.cv.skills && vm.cv.skills.length ? 100 / 6 : 0;
            percentage += vm.cv.education && vm.cv.education.length ? 100 / 6 : 0;
            percentage += vm.cv.employment && vm.cv.employment.length ? 100 / 6 : 0;
            percentage += vm.cv.WishRemAmount ? 100 / 6 : 0;
            percentage += vm.cv.document ? 100 / 6 : 0;
            vm.completeness = Math.round(percentage);
        }

        function emailActivationCode() {
            return api2('accounts/activation')
                .then(function(response) {
                    ui.toast.show('info', 'Verification email sent to ' + response.username);
                });
        }

        function getProfile() {
            user.get()
                .then(function() {
                    user.career.applications()
                        .finally(function() {
                            activate();
                        });
                });
        }

        function linkProfile(provider) {
            user.loginWith(provider)
                .then(function() {
                    vm.profile = user.profile;
                    ui.toast.show('success', 'You have successfully linked a ' + provider + ' account');
                })
                .catch(function(response) {
                    ui.toast.show('error', response.data.error_description, response.status);
                });
        }

        function logout() {
            ui.loading.show();
            return $auth.logout()
                .finally(function() {
                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    });
                    ui.show('app.jobs.tabs.feed', {
                        id: 'it,sect_id-1'
                    }).then(function() {
                        ui.loading.hide();
                        ui.toast.show('info', 'You have been logged out');

                        $timeout($ionicHistory.clearCache, 375);
                    });

                });
        }
    }
})();