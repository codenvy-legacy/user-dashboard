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
var DEV = true;

angular.module('odeskApp', [
    'angular-lodash',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngAnimate',
    'braintree-angular',
    'ui.bootstrap',
    'chieffancypants.loadingBar',
    'ui.codemirror',
    'ui.select',
    'angularFileUpload',
    'ngClipboard'
]).config(function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = false;
}).constant('udCodemirrorConfig', {
    codemirror: {
        lineWrapping: true,
        lineNumbers: true,
        mode: 'application/json',
        gutters: ['CodeMirror-lint-markers', 'CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        lint: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        foldGutter: true,
        styleActiveLine: true,
        theme: 'codenvy'
    }
}).config(function () {
    uiCodemirrorDirective.$inject = ["$timeout", "udCodemirrorConfig"];
}).factory('AuthInterceptor', function ($window, $cookies, $q) {
    return {
        request: function (config) {
            //remove prefix url
            if (config.url.indexOf("http://dev.box.com/api") == 0) {
                config.url = config.url.substring("http://dev.box.com".length);
            }

            //Do not add token on auth login
            if (config.url.indexOf("/api/auth/login") == -1 && config.url.indexOf("api/") != -1 && $cookies.token) {
                config.params = config.params || {};
                angular.extend(config.params, {token: $cookies.token});
            }
            return config || $q.when(config);
        },
        response: function (response) {
            if (response.status === 401 || response.status == 403) {
                $log.info('Redirect to login page.')
                $location.path('/login');
            }
            return response || $q.when(response);
        }
    };
}).config(function ($routeProvider, $locationProvider, $httpProvider) {
    var DEFAULT;
    var BASE_URL;

    if (DEV) {
        DEFAULT = '/login';
        BASE_URL = '/';
    } else {
        DEFAULT = '/dashboard';
        BASE_URL = '/dashboard/';
    }

    if (DEV) {
        $httpProvider.interceptors.push('AuthInterceptor');
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
        .when('/factory/:id', {
            templateUrl: BASE_URL + 'views/factorydetails.html',
            controller: 'FactoryCtrl'
        })
        .when('/stats', {
            templateUrl: BASE_URL + 'views/stats.html',
            controller: 'StatsCtrl'
        })
        .when('/runner', {
            templateUrl: BASE_URL + 'views/runner.html',
            controller: 'RunnerCtrl'
        })
        .when('/admin', {
            templateUrl: BASE_URL + 'views/admin.html',
            controller: 'AdminCtrl'
        })
        .when('/organizations', {
            templateUrl: BASE_URL + 'views/organization/workspaces.html',
            controller: 'OrganizationsCtrl'
        })
        .when('/organizations/members', {
            templateUrl: BASE_URL + 'views/organization/members.html',
            controller: 'OrganizationsCtrl'
        })
        .when('/organizations/workspace/:id', {
            templateUrl: BASE_URL + 'views/organization/workspace_info.html',
            controller: 'workspaceInfoCtrl'
        })
        .when('/organizations/workspace/:id/members', {
            templateUrl: BASE_URL + 'views/organization/workspace_members.html',
            controller: 'workspaceInfoCtrl'
        })
        .when('/organizations/:name', {
            templateUrl: BASE_URL + 'views/orgdetail.html',
            controller: 'OrgdetailCtrl'
        })
        .when('/account', {
            templateUrl: BASE_URL + 'account/profile.html',
            controller: 'ProfileCtrl'
        })
        .when('/account/subscriptions', {
            templateUrl: BASE_URL + 'account/subscription/subscriptions.html',
            controller: 'SubscriptionCtrl'
        })
        .when('/account/profile', {
            templateUrl: BASE_URL + 'account/profile.html',
            controller: 'ProfileCtrl'
        })
        .when('/account/billing', {
            templateUrl: BASE_URL + 'account/billing/billing.html',
            controller: 'BillingCtrl'
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
}).directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                // this next if is necessary for when using ng-required on your input.
                // In such cases, when a letter is typed first, this parser will be called
                // again, and the 2nd time, the value will be undefined
                if (!inputValue) return ''
                var transformedInput = inputValue.replace(/[^0-9+.]/g, '');
                if (transformedInput != inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
}).run(['$rootScope', function ($rootScope) {

}]);

angular.module('ui.bootstrap.carousel', ['ui.bootstrap.transition'])
    .controller('CarouselController', ['$scope', '$timeout', '$transition', '$q', function ($scope, $timeout, $transition, $q) {
    }]).directive('carousel', [function () {
        return { }
    }]);
