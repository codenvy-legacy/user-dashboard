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
]).config([
  '$routeProvider',
  '$locationProvider',
  function ($routeProvider, $locationProvider) {
    $routeProvider.when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl'
    }).when('/dashboard', {
      templateUrl: 'views/dashboard.html',
      controller: 'DashboardCtrl'
    }).when('/factories', {
      templateUrl: 'views/factories.html',
      controller: 'FactoriesCtrl'
    }).when('/stats', {
      templateUrl: 'views/stats.html',
      controller: 'StatsCtrl'
    }).when('/admin', {
      templateUrl: 'views/admin.html',
      controller: 'AdminCtrl'
    }).when('/organizations', {
      templateUrl: 'views/organizations.html',
      controller: 'OrganizationsCtrl'
    }).when('/account', {
      templateUrl: 'views/account/profile.html',
      controller: 'DashboardCtrl'
    }).when('/account/configuration', {
      templateUrl: 'views/account/configuration.html',
      controller: 'AccountConfigCtrl'
    }).when('/account/preferences', {
      templateUrl: 'views/account/preferences.html',
      controller: 'DashboardCtrl'
    }).when('/account/profile', {
      templateUrl: 'views/account/profile.html',
      controller: 'DashboardCtrl'
    }).when('/account/billing', {
      templateUrl: 'views/account/billing.html',
      controller: 'DashboardCtrl'
    }).otherwise({ redirectTo: '/login' });  //while uncommenting line below fix # in navbar.js
                                             //$locationProvider.html5Mode(true);
  }
]);
/*jslint
    browser: true,
    devel:true ,
    node:true,
    nomen: true,
    es5:true
*/
/**
 * @auth Gaurav Meena
 * @date 03/23/2014
 * Controller for login
 */
/*global angular, $*/
'use strict';
angular.module('odeskApp').controller('LoginCtrl', [
  '$scope',
  '$timeout',
  '$http',
  '$location',
  function ($scope, $timeout, $http, $location) {
    $scope.username = 'test';
    $scope.password = 'test';
    $scope.submit = function () {
      $http({
        url: '/api/auth/login',
        method: 'POST',
        data: {
          'username': $scope.username,
          'password': $scope.password
        }
      }).then(function (response) {
        // success
        //window.location.href = "/#/dashboard";
        $location.path('/dashboard');
      }, function (response) {
        // optional
        alert('error');
        console.log(response);
      });
    };
  }
]);
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
 * Controller for navbar will automatically check for active view to set class active
 */
/*global angular*/
'use strict';
angular.module('odeskApp').controller('NavbarCtrl', [
  '$scope',
  '$location',
  function ($scope, $location) {
    $scope.menu = [
      {
        'title': 'Admin',
        'link': '#/admin'
      },
      {
        'title': 'Projects',
        'link': '#/dashboard'
      },
      {
        'title': 'Factories',
        'link': '#/factories'
      },
      {
        'title': 'Stats',
        'link': '#/stats'
      },
      {
        'title': 'Account',
        'link': '#/account'
      },
      {
        'title': 'Organizations',
        'link': '#/organizations'
      }
    ];
    $scope.isActive = function (route) {
      //return route === '#' + $location.path(); //here # is added because of location html5 mode        
      var str = '#' + $location.path(), str2 = route;
      if (str.indexOf(str2) > -1) {
        return true;
      } else {
        return false;
      }
    };
  }
]);
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
 * Controller for dashboard/projects
 */
/*global angular, $*/
'use strict';
angular.module('odeskApp').controller('DashboardCtrl', [
  '$scope',
  '$timeout',
  'projectList',
  function ($scope, $timeout, projectList) {
    $scope.box = 1;
    $scope.search = 0;
    $scope.projects = projectList.query();
    $scope.filter = {};
    $timeout(function () {
      $('[rel=tooltip]').tooltip({ placement: 'bottom' });
      $(document).on('click', '.searchfield', function () {
        console.log('cl1');
        $('.searchfull').show();
        $('.detail').animate({ opacity: 0 }, 400);
        $('.searchfull').animate({ width: '100%' }, 400, function () {
          $('.closeBtn').show();
        });
      });
      $(document).on('click', '.closeBtn', function () {
        console.log('cl2');
        $('.closeBtn').hide();
        $('.detail').animate({ opacity: 1 }, 400);
        $('.searchfull').animate({ width: '43px' }, 400, function () {
          $('.searchfull').hide();
        });
      });  //new code end
    });
    $scope.test = function () {
      console.log(this);
    };
  }
]);
angular.module('odeskApp').directive('stopEvent', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      element.bind(attr.stopEvent, function (e) {
        e.stopPropagation();
      });
    }
  };
});
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
 * Controller for factories
 */
/*global angular, Morris*/
'use strict';
angular.module('odeskApp').controller('FactoriesCtrl', [
  '$scope',
  '$timeout',
  'projectList',
  function ($scope, $timeout, projectList) {
    $scope.projects = projectList.query();
    $scope.filter = {};
    var Data = [
        {
          x: '2011 Q1',
          y: 3,
          z: 3
        },
        {
          x: '2011 Q2',
          y: 2,
          z: 1
        },
        {
          x: '2011 Q3',
          y: 2,
          z: 4
        },
        {
          x: '2011 Q4',
          y: 3,
          z: 3
        },
        {
          x: '2011 Q5',
          y: 3,
          z: 4
        }
      ];
    $timeout(function () {
      Morris.Line({
        element: 'graph-area-line',
        behaveLikeLine: false,
        data: Data,
        xkey: 'x',
        ykeys: ['z'],
        labels: ['Z'],
        grid: false,
        lineWidth: 1,
        smooth: false,
        goals: [0],
        goalLineColors: ['#d9d9d9'],
        eventLineColors: ['#d9d9d9'],
        events: [Data[0].x],
        pointSize: 5,
        pointFillColors: ['#ffffff'],
        pointStrokeColors: ['#90c6ec'],
        hoverCallback: function (index, options, content) {
          var row = options.data[index];
          return '<div class=\'morris-hover-row-label\'>' + row.z + ' Sessions</div><div class=\'morris-hover-point\'>235 Minutes</div>';
        },
        lineColors: ['#e5e5e5']
      });
      $(document).on('click', '.searchfield', function () {
        console.log('cl1');
        $('.searchfull').show();
        $('.detail').animate({ opacity: 0 }, 400);
        $('.searchfull').animate({ width: '100%' }, 400, function () {
          $('.closeBtn').show();
        });
      });
      $(document).on('click', '.closeBtn', function () {
        console.log('cl2');
        $('.closeBtn').hide();
        $('.detail').animate({ opacity: 1 }, 400);
        $('.searchfull').animate({ width: '43px' }, 400, function () {
          $('.searchfull').hide();
        });
      });
    });
  }
]);
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
 * stats page controller
 */
/*global angular, Morris, $*/
'use strict';
angular.module('odeskApp').controller('StatsCtrl', [
  '$scope',
  '$http',
  function ($scope, $http) {
    var Data = [
        {
          x: '2012-11-16',
          y: 2,
          z: 6
        },
        {
          x: '2012-11-18',
          y: 2,
          z: 4
        },
        {
          x: '2012-11-20',
          y: 3,
          z: 3
        },
        {
          x: '2012-11-24',
          y: 3,
          z: 4
        },
        {
          x: '2012-11-26',
          y: 3,
          z: 5
        },
        {
          x: '2012-11-28',
          y: 3,
          z: 6
        },
        {
          x: '2012-11-30',
          y: 3,
          z: 8
        },
        {
          x: '2012-12-01',
          y: 3,
          z: 4
        },
        {
          x: '2012-12-03',
          y: 3,
          z: 7
        },
        {
          x: '2012-12-05',
          y: 3,
          z: 10
        },
        {
          x: '2012-12-07',
          y: 3,
          z: 9
        },
        {
          x: '2012-12-09',
          y: 3,
          z: 11
        },
        {
          x: '2012-12-11',
          y: 3,
          z: 12
        },
        {
          x: '2012-12-13',
          y: 3,
          z: 13
        },
        {
          x: '2012-12-15',
          y: 3,
          z: 14
        },
        {
          x: '2012-12-18',
          y: 3,
          z: 15
        }
      ];
    setTimeout(function () {
      Morris.Area({
        element: 'graph-area-line',
        behaveLikeLine: false,
        data: Data,
        xkey: 'x',
        ykeys: ['z'],
        labels: ['Z'],
        grid: false,
        lineWidth: 1,
        smooth: false,
        goals: [0],
        xLabels: 'day',
        hoverCallback: function (index, options, content) {
          var row = options.data[index];
          return '<div class=\'morris-hover-row-label\'>' + row.z + ' Sessions</div><div class=\'morris-hover-point\'>235 Minutes</div>';
        },
        goalLineColors: ['#d9d9d9'],
        eventLineColors: ['#d9d9d9'],
        events: [Data[0].x],
        pointSize: 5,
        pointFillColors: ['#ffffff'],
        pointStrokeColors: ['#90c6ec'],
        lineColors: ['#eff4f8']
      });
      if ($('.sparkline').length > 0) {
        $('.sparkline').sparkline('html', {
          enableTagOptions: true,
          disableHiddenCheck: true
        });
      }
    }, 50);
  }
]);
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
 * This script will contain all controller related to account section
 */
/*global angular*/
'use strict';
angular.module('odeskApp').controller('AccountConfigCtrl', [
  '$scope',
  '$http',
  function ($scope, $http) {
  }
]);
/*jslint
    browser: true,
    devel:true ,
    node:true,
    nomen: true,
    es5:true
*/
/**
 * @auth Gaurav Meena
 * @date 03/23/2014
 * Controller for organizations
 */
/*global angular, $*/
'use strict';
angular.module('odeskApp').controller('OrganizationsCtrl', [
  '$scope',
  '$timeout',
  'projectList',
  function ($scope, $timeout, projectList) {
    $scope.organizations = 1;
  }
]);
/*jslint
    browser: true,
    devel:true ,
    node:true,
    nomen: true,
    es5:true
*/
/**
 * @auth Gaurav Meena
 * @date 03/23/2014
 * Controller for admin
 */
/*global angular, $*/
'use strict';
angular.module('odeskApp').controller('AdminCtrl', [
  '$scope',
  '$timeout',
  '$http',
  'projectList',
  function ($scope, $timeout, $http, projectList) {
  }
]);
/*jslint
    browser: true,
    devel:true ,
    node:true,
    nomen: true,
    es5:true
*/
/**
 * @auth Gaurav Meena
 * @date 01/30/2014
 * service 
 */
/*global angular*/
'use strict';
angular.module('odeskApp').factory('projectList', [
  '$resource',
  function ($resource) {
    return $resource('./api/workspace/all', {}, {
      query: {
        method: 'GET',
        params: {},
        isArray: true
      }
    });
  }
]);