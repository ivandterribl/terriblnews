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

    /**
    TRUNCATE TABLE users;
    TRUNCATE TABLE user_profile;
    TRUNCATE TABLE user_activation;
    TRUNCATE TABLE oauth_users;
    TRUNCATE TABLE oauth_refresh_tokens;
    TRUNCATE TABLE oauth_authorization_codes;
    TRUNCATE TABLE oauth_access_tokens;

    SET @login_id = 148820;
    SET @cvid = 135596;

    DELETE FROM `cvupload` WHERE CVID = @cvid;
    DELETE FROM `cv_employment` WHERE LoginID = @login_id;
    DELETE FROM `cv_education` WHERE LoginID = @login_id;
    DELETE FROM `cv_skills` WHERE LoginID = @login_id;
    DELETE FROM `cv_main` WHERE LoginID = @login_id;
    DELETE FROM `login` WHERE LoginID = @login_id;

    UPDATE cv_main SET LastAccessDate = '2012-11-12 16:48:25' WHERE CVID = 73389
    */
})();