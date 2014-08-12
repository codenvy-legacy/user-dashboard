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

      console.log(Workspace.query())
      var old_description = '';
      $scope.box = 1;
      $scope.search = 0;
      $scope.runners = [];
      $scope.ownerWorkspace = '';
      Workspace.all(function (resp) {
        $scope.workspaces = _.filter(resp, function (workspace) {return !workspace.workspaceReference.temporary;});
        angular.forEach($scope.workspaces, function (value) {
          console.log(value)
          /*$http({method: 'GET', url: $.map(value.workspaceReference.links,function(obj){if(obj.rel=="get projects") return obj.href})[0]}).
              success(function (data, status) {
                $scope.projects = $scope.projects.concat(data);
              });*/
        });
      });

    });