(function() {
    'use strict';

    angular
        .module('itw.jobs')
        .controller('JobProfileController', Controller);

    Controller.$inject = [];
    /* @ngInject */
    function Controller() {
        var vm = this,
            defaults = {
                education: {
                    course: null,
                    institution: null,
                    dateCompleted: null
                },
                employment: {}
            };

        vm.addEducation = function() {
            vm.education.push(defaults.education);
        };
        vm.addEmployment = function() {
            vm.employment.push(defaults.employment);
        };
        activate();

        function activate() {
            vm.education = [defaults.education];
            vm.employment = [defaults.employment];

            vm.skills = {
                'A': {
                    title: 'Operating systems',
                    skills: [
                        'Windows',
                        'Windows (server)',
                        'Windows (mobile)',
                        'UNIX',
                        'Linux',
                        'OSX',
                        'iOS',
                        'Android',
                        'Embeded'
                    ]
                },
                'B': {
                    title: 'Development',
                    skills: [
                        'C #',
                        'C++',
                        'Objective C',
                        'Swift',
                        'dot Net',
                        'JavaScript',
                        'JAVA',
                        'PHP',
                        'Python',
                        'Ruby on Rails'
                    ]
                },
                'C': {
                    title: 'Networking',
                    skills: [
                        'WAN',
                        'WAN (fibre)',
                        'LAN',
                        'Mobile (3G/LTE)',
                        'Firewall/Proxy',
                        'Routing',
                        'Cabling'
                    ]
                },
                'D': {
                    title: 'Databases',
                    skills: [
                        'MSSQL',
                        'Oracle',
                        'mySQL',
                        'PostgreSQL',
                        'MongoDB',
                        'DB2',
                        'Cassandra',
                        'SQLite',
                        'Query language'
                    ]
                },
                'E': {
                    title: 'Other',
                    skills: []
                }
            }
        }

    }
})();