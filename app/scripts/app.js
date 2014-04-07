/*jslint
    browser: true,
    devel:true ,
    node:true,
    nomen: true,
    es5:true
*/

/**
 * @auth Gaurav Meena
 * @date 01/16/2014
 * This is the main router and controller handler file for angular MVC
 */

/*global angular*/

'use strict';
var DEV = false;
var BASE_URL = '/dashboard/';

angular.module('odeskApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngAnimate'
]).config(function ($routeProvider, $locationProvider) {
    var DEFAULT;
    
    if (DEV) {
        DEFAULT = '/login';
    } else {
        DEFAULT = '/dashboard';
    }
    
    $routeProvider
	    .when('/dashboard', {
            templateUrl: BASE_URL + 'views/dashboard.html',
            controller: 'DashboardCtrl'
        })
	    .when('/factories', {
            templateUrl: BASE_URL + 'views/factories.html',
            controller: 'FactoriesCtrl'
        })
	    .when('/stats', {
            templateUrl: BASE_URL + 'views/stats.html',
            controller: 'StatsCtrl'
        })
        .when('/admin', {
            templateUrl: BASE_URL + 'views/admin.html',
            controller: 'AdminCtrl'
        })
	    .when('/organizations', {
            templateUrl: BASE_URL + 'views/organizations.html',
            controller: 'OrganizationsCtrl'
        })
	    .when('/organizations/:name', {
            templateUrl: BASE_URL + 'views/orgdetail.html',
            controller: 'OrgdetailCtrl'
        })
        .when('/account', {
            templateUrl: BASE_URL + 'views/account/profile.html',
            controller: 'AccountConfigCtrl'
        })
        .when('/account/configuration', {
            templateUrl: BASE_URL + 'views/account/configuration.html',
            controller: 'AccountConfigCtrl'
        })
        .when('/account/preferences', {
            templateUrl: BASE_URL + 'views/account/preferences.html',
            controller: 'AccountConfigCtrl'
        })
        .when('/account/profile', {
            templateUrl: BASE_URL + 'views/account/profile.html',
            controller: 'AccountConfigCtrl'
        })
        .when('/account/billing', {
            templateUrl: BASE_URL + 'views/account/billing.html',
            controller: 'DashboardCtrl'
        })
        .when('/login', {
            templateUrl: BASE_URL + 'views/login.html',
            controller: 'LoginCtrl'
        })
        .otherwise({
            redirectTo: DEFAULT
        });
    
	//while uncommenting line below fix # in navbar.js
    //$locationProvider.html5Mode(true);
});