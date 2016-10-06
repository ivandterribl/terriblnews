(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('ui', UI);

    UI.$inject = ['$q', '$state', '$ionicLoading', '$ionicPopup', 'toastr'];

    function UI($q, $state, $ionicLoading, $ionicPopup, toastr) {
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
                    if (method === 'error' && !message) {
                        message = 'General error occurred. Our team has been notified.';
                    }
                    return toastr[method](message, title, optionsOverride);
                },
                hide: function() {
                    return toastr.clear(arguments);
                }
            },
            popup: {
                confirm: {
                    show: function(options) {
                        var deferred = $q.defer(),
                            opts = angular.extend({
                                title: 'Are you sure'
                            }, options),
                            confirmPopup = $ionicPopup.confirm(opts);
                        confirmPopup
                            .then(function(result) {
                                if (result) {
                                    deferred.resolve();
                                } else {
                                    deferred.reject();
                                }
                            })
                            .catch(function() {
                                deferred.reject();
                            });
                        return deferred.promise;
                    }
                }
            }

        };
        return ui;
    }
})();