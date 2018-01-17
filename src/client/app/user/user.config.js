(function() {
    'use strict';

    angular
        .module('itw.user')
        .config(Config);

    Config.$inject = ['$authProvider', '$httpProvider'];

    function Config($authProvider, $httpProvider) {
        var redirectUri = window.location.href;
        if (redirectUri.indexOf('#') !== -1) {
            redirectUri = redirectUri.split('#')[0];
        }
        //redirectUri = 'http://localhost:3000/user/authorize';
        redirectUri = 'http://v2.itweb.co.za/mobilesite/user/authorize';
        //redirectUri = 'http://www.itweb.co.za/mobilesite/news';

        $authProvider.facebook({
            url: 'accounts/authorize',
            clientId: 'itweb/app',
            authorizationEndpoint: 'https://secure.itweb.co.za/api/accounts/link/3',
            redirectUri: redirectUri
        });

        $authProvider.google({
            url: 'accounts/authorize',
            clientId: 'itweb/app',
            authorizationEndpoint: 'https://secure.itweb.co.za/api/accounts/link/2',
            redirectUri: redirectUri
        });

        $authProvider.withCredentials = true;
        $authProvider.baseUrl = 'https://secure.itweb.co.za/api/';
        $authProvider.tokenName = 'access_token';
        $authProvider.tokenPrefix = 'itweb';
        $authProvider.loginUrl = '/accounts/login';
        $authProvider.logoutUrl = '/accounts/logout';
        $authProvider.signupUrl = '/accounts/signup';
        $authProvider.unlinkUrl = '/accounts/unlink';
    }

})();