(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('jobs', Jobs)
        .factory('job', Job);

    Jobs.$inject = ['api2'];

    function Jobs(api2) {

        return {
            get: function get() {

            }
        }
    }

    Job.$inject = ['api2'];

    function Job(api2) {

        return {
            get: function get() {

            }
        }
    }
})();