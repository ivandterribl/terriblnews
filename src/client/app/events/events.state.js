(function() {
    'use strict';

    angular
        .module('app.events')
        .config(Config);

    Config.$inject = ['$stateProvider'];

    function Config($stateProvider) {
        $stateProvider
            .state('app.events', {
                params: {
                    id: 'events'
                },
                url: '/events',
                templateUrl: 'app/events/events.html',
                controller: 'EventsController as vm'
            })
            .state('app.event', {
                url: '/events/:id',
                templateUrl: 'app/events/event.html',
                controller: 'EventController as vm'
            });
    }
})();