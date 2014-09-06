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

angular.module('odeskApp')
    .controller('OrganizationsCtrl', function ($scope, Workspace, $http, $q, $cookies, $timeout) {
      $scope.workspaces = [];
      Workspace.all(function (resp) {
        $scope.workspaces = _.filter(resp, function (workspace) { return !workspace.workspaceReference.temporary; });
      });
    });
