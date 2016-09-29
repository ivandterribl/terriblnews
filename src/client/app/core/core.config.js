(function() {
	'use strict';

	angular
		.module('app.core')
		.config(Config);

	Config.$inject = ['$ionicConfigProvider', 'AnalyticsProvider'];

	function Config($ionicConfigProvider, AnalyticsProvider) {
		AnalyticsProvider.useAnalytics(false)
			.setAccount('UA-44652885-1')
			.setDomainName('www.itwebafrica.com')
			.trackPrefix('m')
			.ignoreFirstPageLoad(true)
			.trackPages(true)
			.setPageEvent('$stateChangeSuccess');

		$ionicConfigProvider.views.maxCache(3);
	}
})();