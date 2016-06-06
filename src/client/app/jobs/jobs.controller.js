(function() {
    'use strict';

    angular
        .module('itw.jobs')
        .controller('JobsController', Controller);

    Controller.$inject = ['api2', 'user', 'activeNav', 'jobs', '$scope', '$state', '$location', 'searchBar'];
    /* @ngInject */
    function Controller(api2, user, activeNav, jobs, $scope, $state, $location, searchBar) {
        console.log(jobs);
        var vm = this,
            limit = $state.params.limit || 16,
            limitstart = jobs.length || limit;

        vm.loadItems = loadItems;
        vm.showSearchbar = showSearchbar;
        activate();

        function activate() {
            vm.analyticsEvent = $location.url();

            vm.category = activeNav;
            vm.hasSubheader = $state.params.subheader;

            vm.items = _.map(jobs, function(job) {
                var application;
                if (user.$auth.isAuthenticated() && user.profile) {
                    application = _.find(user.profile.careerweb.applications, {
                        uniq: job.uniq
                    });
                }
                return angular.extend(job, {
                    application: application
                });
            });
            vm.complete = 0;
            // cached view
            $scope.$on('$ionicView.enter', function() {
                $scope.$emit('category', activeNav.item);
            });
        }

        function showSearchbar() {
            searchBar.show({
                stateName: 'app.jobs.search'
            });
        }

        function loadItems() {
            api2('jobs/category/' + activeNav.id + '?limitstart=' + limitstart + '&limit=' + limit)
                .then(function(response) {
                    vm.items = vm.items.concat(response);

                    $scope.$broadcast('scroll.infiniteScrollComplete');

                    limitstart += response.length;
                    vm.complete = 0;
                })
                .catch(function() {
                    vm.items = [];
                    vm.complete = 1;
                })
                .finally(function() {
                    vm.loading = 0;
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }
    }
})();