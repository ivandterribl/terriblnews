(function(window, angular, undefined) {
	'use strict';
	// jshint ignore:start
	// jscs:disable
	angular
		.module('itw.ui.tabs')
		.factory('$mdConstant', MdConstantFactory);

	/**
	 * Factory function that creates the grab-bag $mdConstant service.
	 * ngInject
	 */
	function MdConstantFactory($sniffer) {

		var webkit = /webkit/i.test($sniffer.vendorPrefix);

		function vendorProperty(name) {
			return webkit ? ('webkit' + name.charAt(0).toUpperCase() + name.substring(1)) : name;
		}

		return {
			CSS: {
				/* Constants */
				TRANSITIONEND: 'transitionend' + (webkit ? ' webkitTransitionEnd' : ''),
				ANIMATIONEND: 'animationend' + (webkit ? ' webkitAnimationEnd' : ''),

				TRANSFORM: vendorProperty('transform'),
				TRANSFORM_ORIGIN: vendorProperty('transformOrigin'),
				TRANSITION: vendorProperty('transition'),
				TRANSITION_DURATION: vendorProperty('transitionDuration'),
				ANIMATION_PLAY_STATE: vendorProperty('animationPlayState'),
				ANIMATION_DURATION: vendorProperty('animationDuration'),
				ANIMATION_NAME: vendorProperty('animationName'),
				ANIMATION_TIMING: vendorProperty('animationTimingFunction'),
				ANIMATION_DIRECTION: vendorProperty('animationDirection')
			}
		};
	}
	MdConstantFactory.$inject = ['$sniffer'];

	var nextUniqueId = 0;

	/**
	 * @ngdoc module
	 * @name material.core.util
	 * @description
	 * Util
	 */
	angular
		.module('itw.ui.tabs')
		.factory('$mdUtil', UtilFactory);

	function UtilFactory($document, $timeout, $compile, $rootScope, $interpolate, $log, $rootElement, $window) {

		var $mdUtil = {
			// Returns a function, that, as long as it continues to be invoked, will not
			// be triggered. The function will be called after it stops being called for
			// N milliseconds.
			// @param wait Integer value of msecs to delay (since last debounce reset); default value 10 msecs
			// @param invokeApply should the $timeout trigger $digest() dirty checking
			debounce: function(func, wait, scope, invokeApply) {
				var timer;

				return function debounced() {
					var context = scope,
						args = Array.prototype.slice.call(arguments);

					$timeout.cancel(timer);
					timer = $timeout(function() {

						timer = undefined;
						func.apply(context, args);

					}, wait || 10, invokeApply);
				};
			},

			// Returns a function that can only be triggered every `delay` milliseconds.
			// In other words, the function will not be called unless it has been more
			// than `delay` milliseconds since the last call.
			throttle: function throttle(func, delay) {
				var recent;
				return function throttled() {
					var context = this;
					var args = arguments;
					var now = $mdUtil.now();

					if (!recent || (now - recent > delay)) {
						func.apply(context, args);
						recent = now;
					}
				};
			},

			/**
			 * Get a unique ID.
			 *
			 * @returns {string} an unique numeric string
			 */
			nextUid: function() {
				return '' + nextUniqueId++;
			},

			// Stop watchers and events from firing on a scope without destroying it,
			// by disconnecting it from its parent and its siblings' linked lists.
			disconnectScope: function disconnectScope(scope) {
				if (!scope) return;

				// we can't destroy the root scope or a scope that has been already destroyed
				if (scope.$root === scope) return;
				if (scope.$$destroyed) return;

				var parent = scope.$parent;
				scope.$$disconnected = true;

				// See Scope.$destroy
				if (parent.$$childHead === scope) parent.$$childHead = scope.$$nextSibling;
				if (parent.$$childTail === scope) parent.$$childTail = scope.$$prevSibling;
				if (scope.$$prevSibling) scope.$$prevSibling.$$nextSibling = scope.$$nextSibling;
				if (scope.$$nextSibling) scope.$$nextSibling.$$prevSibling = scope.$$prevSibling;

				scope.$$nextSibling = scope.$$prevSibling = null;

			},

			// Undo the effects of disconnectScope above.
			reconnectScope: function reconnectScope(scope) {
				if (!scope) return;

				// we can't disconnect the root node or scope already disconnected
				if (scope.$root === scope) return;
				if (!scope.$$disconnected) return;

				var child = scope;

				var parent = child.$parent;
				child.$$disconnected = false;
				// See Scope.$new for this logic...
				child.$$prevSibling = parent.$$childTail;
				if (parent.$$childHead) {
					parent.$$childTail.$$nextSibling = child;
					parent.$$childTail = child;
				} else {
					parent.$$childHead = parent.$$childTail = child;
				}
			},

			/**
			 * Alternative to $timeout calls with 0 delay.
			 * nextTick() coalesces all calls within a single frame
			 * to minimize $digest thrashing
			 *
			 * @param callback
			 * @param digest
			 * @returns {*}
			 */
			nextTick: function(callback, digest, scope) {
				//-- grab function reference for storing state details
				var nextTick = $mdUtil.nextTick;
				var timeout = nextTick.timeout;
				var queue = nextTick.queue || [];

				//-- add callback to the queue
				queue.push(callback);

				//-- set default value for digest
				if (digest == null) digest = true;

				//-- store updated digest/queue values
				nextTick.digest = nextTick.digest || digest;
				nextTick.queue = queue;

				//-- either return existing timeout or create a new one
				return timeout || (nextTick.timeout = $timeout(processQueue, 0, false));

				/**
				 * Grab a copy of the current queue
				 * Clear the queue for future use
				 * Process the existing queue
				 * Trigger digest if necessary
				 */
				function processQueue() {
					var skip = scope && scope.$$destroyed;
					var queue = !skip ? nextTick.queue : [];
					var digest = !skip ? nextTick.digest : null;

					nextTick.queue = [];
					nextTick.timeout = null;
					nextTick.digest = false;

					queue.forEach(function(callback) {
						callback();
					});

					if (digest) $rootScope.$digest();
				}
			}
		};

		// Instantiate other namespace utility methods

		return $mdUtil;
	}
	UtilFactory.$inject = ['$document', '$timeout', '$compile', '$rootScope', '$interpolate', '$log', '$rootElement', '$window'];
	// jscs:enable
	// jshint ignore:end

})(window, window.angular);