(function() {
	angular
		.module('app.events')
		.factory('audioPlayer', Player);

	Player.$inject = ['$document', '$rootScope'];

	function Player($document, $rootScope) {
		var audio = $document[0].createElement('audio');
		var player,
			playlist = [],
			paused = false,
			current = {
				album: 0,
				track: 0,
				progress: 0
			};

		player = {
			playlist: playlist,

			current: current,

			playing: false,

			play: function(track, album) {
				if (!playlist.length) {
					return;
				}

				if (angular.isDefined(track)) {
					current.track = track;
				}
				if (angular.isDefined(album)) {
					current.album = album;
				}

				if (!paused) {
					audio.src = playlist[current.album].tracks[current.track].url;
					current.progress = 0;
				}
				audio.play();
				player.playing = true;
				paused = false;
			},

			pause: function() {
				if (player.playing) {
					audio.pause();
					player.playing = false;
					paused = true;
				}
			},

			toggle: function(track, album) {
				track = track || 0;
				album = album || 0;
				return player.playing && track === current.track && album === current.album ?
					player.pause() : player.play(track, album);
			},

			reset: function() {
				player.pause();
				current.album = 0;
				current.track = 0;
				current.progress = 0;
			},

			next: function() {
				if (!playlist.length) {
					return;
				}
				paused = false;
				if (playlist[current.album].tracks.length > (current.track + 1)) {
					current.track++;
				} else {
					current.track = 0;
					current.album = (current.album + 1) % playlist.length;
				}
				if (player.playing) {
					player.play();
				}
			},

			previous: function() {
				if (!playlist.length) {
					return;
				}
				paused = false;
				if (current.track > 0) {
					current.track--;
				} else {
					current.album = (current.album - 1 + playlist.length) % playlist.length;
					current.track = playlist[current.album].tracks.length - 1;
				}
				if (player.playing) {
					player.play();
				}
			}
		};

		playlist.add = function(album) {
			if (playlist.indexOf(album) !== -1) {
				return;
			}
			playlist.push(album);
		};

		playlist.remove = function(album) {
			var index = playlist.indexOf(album);
			if (index === current.album) {
				player.reset();
			}
			playlist.splice(index, 1);
		};

		audio.addEventListener('timeupdate', function() {
			current.progress = this.currentTime / this.duration;
		});

		audio.addEventListener('ended', function() {
			$rootScope.$apply(player.next);
		}, false);

		return player;
	}

})();