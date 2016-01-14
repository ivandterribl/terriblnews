/* global moment:false */
(function() {
	'use strict';

	angular
		.module('app.core')
		.constant('_', window._)
        .constant('moment', window.moment);
})();
