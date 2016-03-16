(function() {
    'use strict';

    angular
        .module('app.news')
        .controller('EventController', Controller);

    Controller.$inject = ['audioPlayer', 'api', '_', 'meta', 'moment', '$scope', '$state', '$sce'];
    /* @ngInject */
    function Controller(audioPlayer, api, _, meta, moment, $scope, $state, $sce) {
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
                            var duration = moment.unix(Math.round(item.duration)).utc().format('mm:ss');

                            item.summary = item.summary.trim();
                            item.mmss = duration;
                            return item;
                        });
                        vm.player.playlist.add({
                            title: vm.items ? vm.items[0] : '',
                            tracks: _.map(response, function(item) {
                                return {
                                    title: item.title,
                                    artist: item.artist,
                                    url: item.mp3
                                };
                            })
                        });

                        var tracks = [];
                        _.each(response, function(row) {
                            tracks.push({
                                '@type': 'MusicRecording',
                                'byArtist': row.artist,
                                'duration': moment.duration(Math.round(row.duration), 'seconds').toJSON(),
                                'inAlbum': row.category,
                                'name': row.alias,
                                'url': row.mp3
                            });
                        });

                        meta.description(response[0].summary);
                        meta.keywords(_.pluck(response, 'artist').join(', '));
                        meta.canonical(false);
                        meta.ld({
                            '@context': 'http://schema.org',
                            '@type': 'MusicPlaylist',
                            'name': response[0].category,
                            'numTracks': response.length,
                            'track': tracks
                        });
                        vm.title = response[0].category;
                        document.getElementsByTagName('title')[0].innerText = vm.title + ' audio tracks';
                    }
                })
                .catch(function() {
                    vm.items = [];
                })
                .finally(function() {
                    vm.loading = 0;
                });
        }
    }
})();