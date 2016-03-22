(function() {
    'use strict';

    angular
        .module('itw.ui')
        .directive('itwTimestamp', Timestamp);

    Timestamp.$inject = ['moment'];

    function Timestamp(moment) {
        return {
            restrict: 'EA',
            templateUrl: 'app/ui/timestamp/timestamp.html',
            link: function(scope, element, attributes) {
                scope.$watch(
                    attributes.timestamp,
                    function handleTimestampChangeEvent(newValue) {
                        var now = moment(),
                            created = moment(newValue);
                        if (created.isValid()) {
                            if (now.diff(created, 'minutes') < 60) {
                                scope.timestamp = now.diff(created, 'minutes') + 'm';
                            } else if (now.diff(created, 'hours') < 24) {
                                scope.timestamp = now.diff(created, 'hours') + 'h';
                            } else if (now.diff(created, 'days') < 7) {
                                scope.timestamp = created.format('ddd');
                            } else if (now.diff(created, 'months') < 6) {
                                scope.timestamp = created.format('D MMM');
                            } else {
                                scope.timestamp = created.format('D MMM YY');
                            }
                        }
                    }
                );
            }
        };
    }
})();