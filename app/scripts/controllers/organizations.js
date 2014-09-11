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
  .controller('OrganizationsCtrl', function ($scope, Account,WorkspaceInfo,Workspace, $http, $q) {

    $scope.isOrgAddOn = false;
    $scope.accountId = [];
    var serviceIds = ["Saas", "OnPremises"];
    var packages = ["Team", "Enterprise"];

    return $q.all([
      Account.getAccountId().then(function (response){
        $scope.accountId.push(_.pluck(_.pluck(response, 'accountReference'), 'id')[0]);
      })
    ]).then(function () {
      Account.getSubscription($scope.accountId[0]).then(function (response){
        var serviceId = _.pluck(response, 'serviceId')[0];
        var packageName = _.pluck(_.pluck(response, 'properties'),'Package')[0];
        if(_.contains(serviceIds, serviceId) && _.contains(packages, packageName)) {
          $scope.isOrgAddOn = true;
          $scope.workspaces = [];
          $scope.filter = {};

          // Display workspace details in workspace
          $http({method: 'GET', url: '/api/workspace/find/account?id='+$scope.accountId[0]})
            .success(function (workspaces) {

              angular.forEach(workspaces, function (workspace) {
                //  Get workspace's projects and developers using workspace id
                WorkspaceInfo.getDetail(workspace.id).then(function (response){
                  var projectsLength;
                  var membersLength;

                  return $q.all([
                    $http({method: 'GET', url: $.map(response.links,function(obj){if(obj.rel=="get projects") return obj.href})[0]})
                      .success(function (data) {
                        projectsLength = data.length;
                      }),

                    $http({method: 'GET', url: $.map(response.links,function(obj){if(obj.rel=="get members") return obj.href})[0]})
                      .success(function (data) {
                        membersLength = data.length;
                      })
                  ]).then(function (results) {
                      var workspaceDetails = {
                        name: workspace.name,
                        projects: projectsLength,
                        developers: membersLength
                      }

                      $scope.workspaces.push(workspaceDetails);
                    });
                });

              });
            })
            .error(function (err) {  });
        }else{
          $scope.isOrgAddOn = false;
          window.location = "/#/dashboard"
        }
      });
    });
  });
