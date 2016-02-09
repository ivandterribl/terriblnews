(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('AboutController', Controller);

    Controller.$inject = ['api'];
    /* @ngInject */
    function Controller(api) {
        var vm = this;

        activate();

        function activate() {
            vm.groups = groups();
        }

        function groups() {
            return [{
                title: 'Online',
                items: [{
                    title: 'ITWeb Online',
                    templateUrl: 'app/about/about-itweb.html'
                }, {
                    title: 'ITWeb eNews',
                    templateUrl: 'app/about/about-enews.html'
                }, {
                    title: 'ITWeb Africa',
                    templateUrl: 'app/about/about-africa.html'
                }, {
                    title: 'CareerWeb',
                    templateUrl: 'app/about/about-careerweb.html'
                }, {
                    title: 'ITWeb Multimedia',
                    templateUrl: 'app/about/about-multimedia.html'
                }, {
                    title: 'ITWeb on Social Media',
                    templateUrl: 'app/about/about-social.html'
                }]
            }, {
                title: 'Print',
                items: [{
                    title: 'ITWeb Brainstorm',
                    templateUrl: 'app/about/about-brainstorm.html'
                }, {
                    title: 'ICT Insight',
                    templateUrl: 'app/about/about-ict-insight.html'
                }, {
                    title: 'The Margin',
                    templateUrl: 'app/about/about-margin.html'
                }, {
                    title: 'Custom publishing',
                    templateUrl: 'app/about/about-custom-publishing.html'
                }]
            }, {
                title: 'Events',
                items: [{
                    title: 'ITWeb Events',
                    templateUrl: 'app/about/about-events.html'
                }]
            }, {
                title: 'Other websites',
                items: [{
                    title: 'DefenceWeb',
                    templateUrl: 'app/about/about-defenseweb.html'
                }, {
                    title: 'iFashion',
                    templateUrl: 'app/about/about-ifashion.html'
                }, {
                    title: 'HR Pulse',
                    templateUrl: 'app/about/about-hr-pulse.html'
                }, {
                    title: 'TrainingWeb',
                    templateUrl: 'app/about/about-trainingweb.html'
                }]
            }];
        }
    }
})();