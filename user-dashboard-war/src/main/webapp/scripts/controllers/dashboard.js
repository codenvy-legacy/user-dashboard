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

angular.module('odeskApp')
    .controller('DashboardCtrl', function ($scope, $timeout, projectList) {
        
        $scope.box = 1;
        $scope.search = 0;
        $scope.projects = projectList.query();
        $scope.filter = {};
        $timeout(function () {
            $("[rel=tooltip]").tooltip({ placement: 'bottom'});
        });
        
    });
