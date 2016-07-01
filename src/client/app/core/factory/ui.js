(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('ui', UI);

    UI.$inject = ['$state', '$ionicLoading', 'toastr'];

    function UI($state, $ionicLoading, toastr) {
        var ui = {
            show: function() {
                return $state.go.apply($state, arguments);
            },
            loading: {
                show: function() {
                    return $ionicLoading.show.apply($ionicLoading, arguments);
                },
                hide: function() {
                    return $ionicLoading.hide.apply($ionicLoading, arguments);
                }
            },
            toast: {
                show: function(method, message, title, optionsOverride) {
                    return toastr[method](message, title, optionsOverride);
                },
                hide: function() {
                    return toastr.clear(arguments);
                }
            }
        };
        return ui;
    }
})();