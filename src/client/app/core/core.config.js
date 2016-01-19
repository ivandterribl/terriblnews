/* global moment:false */
(function() {
	'use strict';

	angular
		.module('app.core')
		.config(Config);

	Config.$inject = ['$mdThemingProvider', '$ionicConfigProvider', 'AnalyticsProvider'];

	function Config($mdThemingProvider, $ionicConfigProvider, AnalyticsProvider) {
		AnalyticsProvider.useAnalytics(false)
			.setAccount('UA-72578455-1')
			.setDomainName('itrends.co.za')
			.trackPages(true)
			.setPageEvent('$stateChangeSuccess');

		$ionicConfigProvider.views.maxCache(0);

		$mdThemingProvider.definePalette('iRed', {
			'50': '#fdeae6',
			'100': '#f8ad9e',
			'200': '#f5806a',
			'300': '#f04727',
			'400': '#e93210',
			'500': '#cc2c0e',
			'600': '#af260c',
			'700': '#93200a',
			'800': '#761908',
			'900': '#591306',
			'A100': '#fdeae6',
			'A200': '#f8ad9e',
			'A400': '#e93210',
			'A700': '#93200a',
			'contrastDefaultColor': 'light',
			'contrastDarkColors': '50 100 200 A100 A200'
		});

		$mdThemingProvider.definePalette('iBlue', {
			'50': '#f3f7fb',
			'100': '#bad1e8',
			'200': '#90b4d9',
			'300': '#5b91c7',
			'400': '#4481c0',
			'500': '#3a72ab',
			'600': '#326394',
			'700': '#2b547d',
			'800': '#234466',
			'900': '#1b3550',
			'A100': '#f3f7fb',
			'A200': '#bad1e8',
			'A400': '#4481c0',
			'A700': '#2b547d',
			'contrastDefaultColor': 'light',
			'contrastDarkColors': '50 100 200 300 A100 A200'
		});
		$mdThemingProvider.theme('default')
			.primaryPalette('iBlue', {
				'default': '500', // by default use shade 400 from the pink palette for primary intentions
				'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
				'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
				'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
			})
			.accentPalette('iRed', {
				'default': '500'
			})
			.warnPalette('orange');

	}
})();