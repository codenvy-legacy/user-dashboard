/*jslint
 browser: true,
 devel:true ,
 node:true,
 nomen: true,
 es5:true
 */

/**
 * @auth Parth Chhaiya
 * @date 08/12/2014
 * Controller for runners
 */

'use strict';
angular.module('odeskApp')
    .controller('RunnerCtrl', function ($scope, $timeout, Workspace, Project, Users, $http) {

      $scope.runners = [];
      $scope.projects = [];
      $scope.ramConsumption = [];

      Workspace.all(function (resp) {
        $scope.workspaces = _.filter(resp, function (workspace) {return !workspace.workspaceReference.temporary;});
        angular.forEach($scope.workspaces, function (value) {
          // Get workspace related resources
          $http({method: 'GET', url:"/api/runner/"+ value.workspaceReference.id +"/resources" }).
            success(function (data, status) {

              var workspaceResources = {
                workspaceName: value.workspaceReference.name,
                usedMemory: data.usedMemory,
                totalMemory: data.totalMemory
              }
              $scope.ramConsumption.push(workspaceResources);
            });

          // Get list of runners
          $http({method: 'GET', url: $.map(value.workspaceReference.links,function(obj){if(obj.rel=="get projects") return obj.href})[0]}).
            success(function (data, status) {
              $scope.projects = $scope.projects.concat(data);
              angular.forEach($scope.projects, function (project) {
                $http({method: 'GET', url:"/api/runner/"+ value.workspaceReference.id +"/processes?project="+project.path }).
                  success(function (data, status) {
                    if(data.length > 0){
                      if(data[0].status == "RUNNING"){
                        var runnerDetails = {
                          project: project,
                          startTime: data[0].startTime,
                          shutdownUrl: $.map(data[0].links,function(obj){if(obj.rel=="stop") return obj.href})[0],
                          url: $.map(data[0].links,function(obj){if(obj.rel=="web url") return obj.href})[0],
                          dockerRecipe: $.map(data[0].links,function(obj){if(obj.rel=="runner recipe") return obj.href})[0],
                          terminalUrl: $.map(data[0].links,function(obj){if(obj.rel=="shell url") return obj.href})[0]
                        }
                        $scope.runners.push(runnerDetails);
                      }
                    }
                  });
              });
            });

        });
      });
    });