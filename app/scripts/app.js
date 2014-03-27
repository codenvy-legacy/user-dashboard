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
    'ngRoute',
    'ngAnimate'
]).config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
        })
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
        .when('/admin', {
            templateUrl: 'views/admin.html',
            controller: 'AdminCtrl'
        })
	    .when('/organizations', {
            templateUrl: 'views/organizations.html',
            controller: 'OrganizationsCtrl'
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
            redirectTo: '/login'
        });
	//while uncommenting line below fix # in navbar.js
    //$locationProvider.html5Mode(true);
});