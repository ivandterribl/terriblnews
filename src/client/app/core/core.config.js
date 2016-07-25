/* global moment:false */
(function() {
	'use strict';

	angular
		.module('app.core')
		.config(Config);

	Config.$inject = ['$ionicConfigProvider', 'AnalyticsProvider'];

	function Config($ionicConfigProvider, AnalyticsProvider) {
		//Pre-render token:X5ntL9ZoXJn6ToZteZip
		AnalyticsProvider.useAnalytics(false)
			.setAccount('UA-17526224-1')
			.setDomainName('itweb.co.za')
			.trackPrefix('mobilesite')
			.ignoreFirstPageLoad(true)
			.trackPages(true)
			.setPageEvent('$stateChangeSuccess');

		$ionicConfigProvider.views.maxCache(3);
	}
})();