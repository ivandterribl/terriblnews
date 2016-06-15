(function() {
    'use strict';

    angular
        .module('itw.jobs')
        .controller('CvSkillsController', Controller);

    Controller.$inject = ['user', 'api2', '$state'];
    /* @ngInject */
    function Controller(user, api2, $state) {
        var vm = this;

        vm.prev = prev;
        vm.next = next;

        vm.lookupSkill = lookupSkill;

        activate();

        function activate() {
            vm.cv = user.profile.careerweb;

            vm.lu = {
                skillList: {
                    'Operating systems': [
                        'Windows',
                        'Windows (server)',
                        'Windows (mobile)',
                        'UNIX',
                        'Linux',
                        'OSX',
                        'iOS',
                        'Android',
                        'Embedded'
                    ],
                    'Development': [
                        'C#',
                        'C++',
                        'Objective C',
                        'Swift',
                        'dot Net',
                        'JavaScript',
                        'JAVA',
                        'PHP',
                        'Python',
                        'Ruby on Rails'
                    ],
                    'Networking': [
                        'WAN',
                        'WAN (fibre)',
                        'LAN',
                        'Mobile (3G/LTE)',
                        'Firewall/Proxy',
                        'Routing',
                        'Cabling'
                    ],
                    'Databases': [
                        'MSSQL',
                        'Oracle',
                        'mySQL',
                        'PostgreSQL',
                        'MongoDB',
                        'DB2',
                        'Cassandra',
                        'SQLite',
                        'Query language'
                    ],
                    'Other': []
                }
            };
        }

        function prev() {
            $state.go('app.jobs.profile-1');
        }

        function next() {
            var form = vm.cvForm;
            console.log('secure.cv', vm);
            form.$setSubmitted(true);
            if (form.$invalid) {
                return;
            }

            $state.go('app.jobs.profile-3');
        }

        function lookupSkill(query) {
            console.log(query);
            return api2('jobs/search/skills?q=' + encodeURIComponent(query));
        }
    }
})();