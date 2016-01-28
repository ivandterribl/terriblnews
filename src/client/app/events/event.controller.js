(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('EventController', Controller);

    Controller.$inject = ['audioPlayer', 'api', '_', '$scope', '$state'];
    /* @ngInject */
    function Controller(audioPlayer, api, _, $scope, $state) {
        var vm = this,
            id = $state.params.id;

        vm.i = 0;
        vm.player = audioPlayer;
        _.each(vm.player.playlist, function(album) {
            vm.player.playlist.remove(album);
        });

        vm.loadItems = loadItems;

        activate();

        function activate() {
            vm.loading = 1;
            vm.items = [];
            loadItems();
        }

        function loadItems() {
            api('tag=event&id=' + id)
                .then(function(response) {
                    if (!angular.equals(vm.items, response)) {
                        vm.items = _.map(response, function(item) {
                            item.summary = _.trim(item.summary);
                            return item;
                        });
                        vm.player.playlist.add({
                            title: _.get(vm, 'items[0]'),
                            tracks: _.map(response, function(item) {
                                return {
                                    title: item.title,
                                    artist: item.artist,
                                    url: item.mp3
                                };
                            })
                        });
                    }
                })
                .catch(function() {
                    vm.items = [];
                })
                .finally(function() {
                    vm.loading = 0;
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }
    }
})();
