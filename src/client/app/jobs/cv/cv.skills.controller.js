(function() {
    'use strict';

    angular
        .module('itw.jobs')
        .controller('CvSkillsController', Controller);

    Controller.$inject = ['user', 'api2', 'ui', '$scope'];
    /* @ngInject */
    function Controller(user, api2, ui, $scope) {
        var vm = this,
            careerweb = user.profile.careerweb,
            defaults = {
                skill: {
                    SkillDescription: null,
                    SkillCompetency: null,
                    MonthsExperience: null
                }
            };;

        vm.addItem = add;
        vm.edit = edit;
        vm.cancel = cancel;
        vm.next = next;
        vm.prev = prev;
        vm.submit = submit;

        activate();

        function activate() {
            var cv = careerweb.cv;

            vm.cv = cv;
            if (!vm.cv.skills || !vm.cv.skills.length) {
                vm.skill = angular.copy(defaults.skill);
            }
        }

        function add() {
            vm.skill = angular.copy(defaults.skill);
        }

        function edit(item) {
            vm.skill = angular.copy(item);
        }

        function cancel() {
            vm.skill = null;
        }

        function isValid(skill) {
            var $valid = 1,
                result = [];

            skill.$submitted = 1;
            angular.forEach(['SkillDescription', 'SkillCompetency', 'MonthsExperience'], function(input) {
                if (!skill[input]) {
                    $valid = 0;
                }
            });
            return $valid;
        }

        function submit(skill) {
            if (!isValid(skill)) {
                return;
            }

            save(skill).then(cancel);
        }

        function save(skill) {
            var payload = [{
                    'SkillID': skill.SkillID,
                    'SkillDescription': skill.SkillDescription,
                    'SkillCompetency': skill.SkillCompetency,
                    'MonthsExperience': skill.MonthsExperience
                }],
                opts = {
                    method: 'POST',
                    data: {
                        LoginID: careerweb.identifier,
                        Skills: payload
                    }
                };

            ui.loading.show();
            return api2('jobs/cv/skills', opts)
                .then(function(cv) {
                    careerweb.cv.skills = _.map(cv.skills, function(row) {
                        return row;
                    });
                    return careerweb.cv;

                }).catch(function(response) {
                    ui.toast.show('error', response.error_description);
                }).finally(function() {
                    ui.loading.hide();
                });

        }

        function prev() {
            var skill = vm.skill;

            if (skill) {
                if (!isValid(skill)) {
                    return;
                } else {
                    // save pending
                    save(skill).then(function() {
                        cancel();
                        ui.show('app.jobs.profile-1');
                    });
                }
            } else {
                ui.show('app.jobs.profile-1');
            }
        }

        function next() {
            var skill = vm.skill;

            if (skill) {
                if (!isValid(skill)) {
                    return;
                } else {
                    // save pending
                    save(skill).then(function() {
                        cancel();
                        ui.show('app.jobs.profile-3');
                    });
                }
            } else {
                ui.show('app.jobs.profile-3');
            }
        }

        function lookups() {
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
                },
                competencyList: ['Trained', 'Beginner', 'Intermediate', 'Advanced'],
                experienceList: [{
                    key: '3',
                    value: '0-6'
                }, {
                    key: '10',
                    value: '6-12'
                }, {
                    key: '20',
                    value: '12-24'
                }, {
                    key: '30',
                    value: '24-36'
                }, {
                    key: '40',
                    value: '36-48'
                }, {
                    key: '50',
                    value: '48-60'
                }, {
                    key: '70',
                    value: '60+'
                }]
            };
        }

    }
})();