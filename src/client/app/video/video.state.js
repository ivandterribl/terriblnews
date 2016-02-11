(function() {
    'use strict';

    angular
        .module('app.video')
        .config(Config);

    Config.$inject = ['$stateProvider'];

    function Config($stateProvider) {
        $stateProvider
            .state('app.video', {
                params: {
                    id: 'video'
                },
                url: '/video',
                templateUrl: 'app/video/video.html',
                controller: 'NewsController as vm'
            })
            .state('app.play', {
                url: '/video/:id',
                params: {
                    title: null
                },
                templateUrl: 'app/video/play.html',
                controller: 'PlayController as vm'
            });
    }
})();