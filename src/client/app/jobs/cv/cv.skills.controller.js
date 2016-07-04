(function() {
    'use strict';

    angular
        .module('itw.jobs')
        .controller('CvSkillsController', Controller);

    Controller.$inject = ['user', 'api2', 'ui', '$scope', '$mdDialog'];
    /* @ngInject */
    function Controller(user, api2, ui, $scope, $mdDialog) {
        var vm = this;

        vm.prev = prev;
        vm.next = next;
        vm.showForm = showForm;

        vm.lookupSkill = lookupSkill;

        activate();

        function showForm(ev) {
            //var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'app/jobs/cv.skills.form.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: true //useFullScreen
                })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });

            function DialogController($scope, $mdDialog) {
                $scope.hide = function() {
                    $mdDialog.hide();
                };
                $scope.cancel = function() {
                    $mdDialog.cancel();
                };
                $scope.answer = function(answer) {
                    $mdDialog.hide(answer);
                };
            }
        }

        function activate() {
            vm.cv = user.profile.careerweb.cv;

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

            vm.description = {};
            vm.competency = {};
            vm.experience = {};
            vm.other = {};
        }

        function prev() {
            ui.show('app.jobs.profile-1');
        }

        function next() {
            var form = vm.cvForm;

            if (!form) {
                return ui.show('app.jobs.profile-3');
            }

            form.$setSubmitted(true);
            if (form.$invalid) {
                return;
            }

            var $valid = true,
                result = [];

            angular.forEach(vm.description, function(active, description) {
                var skill = {
                    SkillDescription: description,
                    SkillCompetency: vm.competency[description],
                    MonthsExperience: vm.experience[description]
                };
                if (active) {
                    result.push(skill);
                    if (!skill.SkillCompetency || !skill.MonthsExperience) {
                        $valid = false;
                    }
                }
            });
            if (vm.other.SkillDescription) {
                result.push(vm.other);
                if (!vm.other.SkillCompetency || !vm.other.MonthsExperience) {
                    $valid = false;
                }
            }
            if (!result.length) {
                $valid = false;
            }

            console.log(result);
            console.log('$valid = ' + $valid);
            if ($valid) {
                ui.loading.show();
                api2('jobs/cv/skills', {
                    method: 'POST',
                    data: {
                        CVID: user.profile.careerweb.cv.CVID,
                        LoginID: user.profile.careerweb.identifier,
                        Skills: result
                    }
                }).then(function(cv) {
                    console.log(cv);
                    user.profile.careerweb.cv.skills = cv.skills;
                    ui.show('app.jobs.profile-3');
                }).catch(function(response) {
                    ui.toast.show('error', response.error_description);
                }).finally(function() {
                    ui.loading.hide();
                });
            }
            //$state.go('app.jobs.profile-3');
        }

        function lookupSkill(query) {
            console.log(query);
            return api2('jobs/search/skills?q=' + encodeURIComponent(query));
        }
    }
})();