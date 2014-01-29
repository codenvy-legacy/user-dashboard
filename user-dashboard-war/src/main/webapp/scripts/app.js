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

angular.module('odeskApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
]).config(function ($routeProvider, $locationProvider) {
    $routeProvider
	    .when('/dashboard', {
            templateUrl: 'views/dashboard.html',
            controller: 'DashboardCtrl'
        })
	    .when('/factories', {
            templateUrl: 'views/factories.html',
            controller: 'FactoriesCtrl'
        })
	    .when('/stats', {
            templateUrl: 'views/stats.html',
            controller: 'StatsCtrl'
        })
        .when('/account', {
            templateUrl: 'views/account/profile.html',
            controller: 'DashboardCtrl'
        })
        .when('/account/configuration', {
            templateUrl: 'views/account/configuration.html',
            controller: 'AccountConfigCtrl'
        })
        .when('/account/preferences', {
            templateUrl: 'views/account/preferences.html',
            controller: 'DashboardCtrl'
        })
        .when('/account/profile', {
            templateUrl: 'views/account/profile.html',
            controller: 'DashboardCtrl'
        })
        .when('/account/billing', {
            templateUrl: 'views/account/billing.html',
            controller: 'DashboardCtrl'
        })
        .otherwise({
            redirectTo: '/dashboard'
        });
	//while uncommenting line below fix # in navbar.js
    //$locationProvider.html5Mode(true);
});