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
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap',
    'chieffancypants.loadingBar'
]).config(function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = false;
}).factory('AuthInterceptor', function ($window, $cookies, $q) {
  return {
    request: function(config) {
      //remove prefix url
      if (config.url.indexOf("https://codenvy.com/api") == 0) {
         config.url = config.url.substring("https://codenvy.com".length);
      }

      //Do not add token on auth login
      if (config.url.indexOf("/api/auth/login") == -1 && config.url.indexOf("api/") != -1 && $cookies.token) {
          config.params = config.params || {};
          angular.extend(config.params, {token: $cookies.token});
      }
      return config || $q.when(config);
    },
    response: function(response) {
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
        .when('/account/subscriptions', {
            templateUrl: BASE_URL + 'views/account/subscriptions.html',
            controller: 'SubscriptionsCtrl'
        })
        .when('/account/subscriptions/:id', {
            templateUrl: BASE_URL + 'views/account/subscriptiondetails.html',
            controller: 'SubscriptionDetailsCtrl'
        })
        .otherwise({
            redirectTo: DEFAULT
        });

	//while uncommenting line below fix # in navbar.js
    //$locationProvider.html5Mode(true);
}).directive('numbersOnly', function(){
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                // this next if is necessary for when using ng-required on your input.
                // In such cases, when a letter is typed first, this parser will be called
                // again, and the 2nd time, the value will be undefined
                if (!inputValue) return ''
                var transformedInput = inputValue.replace(/[^0-9+.]/g, '');
                if (transformedInput!=inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
}).run(['$rootScope', function($rootScope) {
    if (DEV) {
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            console.log('$routeChangeStart', event, next, current);
        });
        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
            console.log('$routeChangeSuccess', event, current, previous);
        });
        $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
            console.log('$routeChangeError', event, current, previous, rejection);
        });
    }
}]);

angular.module('ui.bootstrap.carousel', ['ui.bootstrap.transition'])
    .controller('CarouselController', ['$scope', '$timeout', '$transition', '$q', function ($scope, $timeout, $transition, $q) {
    }]).directive('carousel', [function() {
        return { }
    }]);
