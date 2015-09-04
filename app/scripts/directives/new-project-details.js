/*jslint
 browser: true,
 devel:true ,
 node:true,
 nomen: true,
 es5:true
 */

/**
 * @auth Stéphane Daviet
 * @date 12/1/2014
 * Directive for GitHub project import
 */

/*global angular*/

'use strict';

angular.module('odeskApp')
  .directive('udNewProjectDetails', function() {
      return {
        restrict: 'E',
        require: '^form',

        scope: {
          workspaces: '=',
          workspaceSelected: '=',
          newProjectData: '=',
          projectGroups: '='
        },
        link: function($scope) {
            $scope.$watch('newProjectData.project.type', function(newValue) {
                if (newValue === 'null') {
                    $("textarea[name*='projectDescription']").attr('disabled', 'disabled');
                    $scope.newProjectData.project.description = "";
                } else {
                    $("textarea[name*='projectDescription']").removeAttr('disabled');
                }
            });
        },
        templateUrl: 'partials/widgets/newProjectDetails.html'
      }
  });