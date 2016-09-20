(function () {
    'use strict';

    angular
        .module('itw.ui')
        .directive('itwTimestamp', Timestamp);

    Timestamp.$inject = [];

    function Timestamp() {
        return {
            restrict: 'EA',
            templateUrl: 'app/ui/timestamp/timestamp.html',
            link: function (scope, element, attributes) {
                var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

                scope.$watch(
                    attributes.timestamp,
                    function handleTimestampChangeEvent(newValue) {
                        var now = new Date(),
                            created = new Date(newValue),
                            seconds,
                            minutes,
                            hours,
                            days;

                        if (created.valueOf()) {
                            seconds = (now - created) / 1000;
                            minutes = seconds / 60;
                            hours = minutes / 60;
                            days = hours / 24;

                            if (minutes < 60) {
                                scope.timestamp = Math.floor(minutes) + 'm';
                            } else if (hours < 24) {
                                scope.timestamp = Math.floor(hours) + 'h';
                            } else if (days < 7) {
                                scope.timestamp = dayNames[created.getDay()];
                            } else {
                                scope.timestamp = [
                                    created.getDate(),
                                    monthNames[created.getMonth()],
                                    created.getFullYear()
                                ].join(' ');
                            }
                        }
                    }
                );
            }
        };
    }
})();