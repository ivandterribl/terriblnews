(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('cv', CV);

    CV.$inject = ['api2'];

    function CV(api2) {
        return {
            get: function get() {
                return api2('jobs/cv')
                    .then(function(cv) {
                        if (cv && cv.AffirmativeActionCode) {
                            cv.Gender = cv.AffirmativeActionCode.indexOf('M') === -1 ? 'F' : 'M';
                            cv.Affirmative = cv.AffirmativeActionCode[0];
                            cv.Disabled = cv.AffirmativeActionCode.indexOf('D') !== -1 ? true : false;
                        }
                        return cv;
                    });
            }
        };
    }
})();