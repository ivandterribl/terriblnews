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
                            if (now.diff(created, 'hours') < 24) {
                                scope.timestamp = created.fromNow();
                            } else if (now.diff(created, 'months') < 3) {
                                scope.timestamp = created.format('D MMM');
                            } else {
                                scope.timestamp = created.format('D MMM YYYY');
                            }
                        }

                    }
                );
            }
        };
    }
})();