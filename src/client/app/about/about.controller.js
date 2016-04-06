(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('AboutController', Controller);

    Controller.$inject = ['aboutHtml', '_', '$ionicPlatform', 'nav', '$state'];
    /* @ngInject */
    function Controller(aboutHtml, _, $ionicPlatform, nav, $state) {
        var vm = this;

        activate();

        function activate() {

            var groups = _groups();

            angular.forEach(groups, function(group) {
                angular.forEach(group.items, function(row) {
                    var match = _.findWhere(aboutHtml, {
                        name: row.templateUrl
                    });
                    row.html = match ? match.html : '';
                });
            });
            vm.groups = groups;
        }

        function _groups() {
            return [{
                title: 'Online',
                items: [{
                    title: 'ITWeb Online',
                    templateUrl: 'about-itweb.html'
                }, {
                    title: 'ITWeb eNews',
                    templateUrl: 'about-enews.html'
                }, {
                    title: 'ITWeb Africa',
                    templateUrl: 'about-africa.html'
                }, {
                    title: 'CareerWeb',
                    templateUrl: 'about-careerweb.html'
                }, {
                    title: 'ITWeb Multimedia',
                    templateUrl: 'about-multimedia.html'
                }, {
                    title: 'ITWeb on Social Media',
                    templateUrl: 'about-social.html'
                }]
            }, {
                title: 'Print',
                items: [{
                    title: 'ITWeb Brainstorm',
                    templateUrl: 'about-brainstorm.html'
                }, {
                    title: 'ICT Insight',
                    templateUrl: 'about-ict-insight.html'
                }, {
                    title: 'The Margin',
                    templateUrl: 'about-margin.html'
                }, {
                    title: 'Custom publishing',
                    templateUrl: 'about-custom-publishing.html'
                }]
            }, {
                title: 'Events',
                items: [{
                    title: 'ITWeb Events',
                    templateUrl: 'about-events.html'
                }]
            }, {
                title: 'Other websites',
                items: [{
                    title: 'DefenceWeb',
                    templateUrl: 'about-defenseweb.html'
                }, {
                    title: 'iFashion',
                    templateUrl: 'about-ifashion.html'
                }, {
                    title: 'HR Pulse',
                    templateUrl: 'about-hr-pulse.html'
                }, {
                    title: 'TrainingWeb',
                    templateUrl: 'about-trainingweb.html'
                }]
            }];
        }
    }
})();