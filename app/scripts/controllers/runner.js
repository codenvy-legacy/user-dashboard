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

      var old_description = '';
      $scope.box = 1;
      $scope.search = 0;
      $scope.runners = [];
      $scope.projects = [];
      $scope.ownerWorkspace = '';
      Workspace.all(function (resp) {
        $scope.workspaces = _.filter(resp, function (workspace) {return !workspace.workspaceReference.temporary;});
        angular.forEach($scope.workspaces, function (value) {

          $http({method: 'GET', url: $.map(value.workspaceReference.links,function(obj){if(obj.rel=="get projects") return obj.href})[0]}).
            success(function (data, status) {
              $scope.projects = $scope.projects.concat(data);
              angular.forEach($scope.projects, function (project) {
                $http({method: 'GET', url:"/api/runner/"+ value.workspaceReference.id +"/processes?project="+project.path }).
                  success(function (data, status) {
                    if(data.length > 0){
                      if(data[0].status == "RUNNING"){
                        $scope.runners.push(project);
                      }
                    }
                  });
              });
            });
        });
      });
    });