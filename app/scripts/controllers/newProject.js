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

/*global angular, $*/

'use strict';
angular.module('odeskApp')
    .controller('NewProjectCtrl', [
        '$scope',
        '$modalInstance',
        'currentUserId',
        'workspaces',
        'type',
        'Project',
        'ProjectFactory',
        function(
            $scope,
            $modalInstance,
            currentUserId,
            workspaces,
            type,
            Project,
            ProjectFactory) {

          this.workspaces = workspaces;
          this.currentUserId = currentUserId;
          this.tabActivated = {};
          this.tabActivated[type] = true;

          this.newProjectData = {
          };

          this.setProjectType = function(type) {
            if ($scope.newProjectForm) {
              if ($scope.newProjectForm.projectName && !$scope.newProjectForm.projectName.$touched) {
                this.newProjectData.projectName = undefined;
              }
              if ($scope.newProjectForm.projectName && !$scope.newProjectForm.projectDescription.$touched) {
                this.newProjectData.projectDescription = undefined;
              }
            }
            this.newProjectData.importType = type;
          };

          this.import = function() {
              var factory = {
                v: '2.0',
                source: {
                  project: {
                    location: undefined,
                    type: undefined
                  }
                },
                project: {
                  type: 'blank',
                  visibility: 'public'
                }
              };

              switch (this.newProjectData.importType) {
                case 'GitHub':
                  if (this.newProjectData.remoteUrl) {
                    factory.source.project.location = this.newProjectData.remoteUrl;
                  }
                  factory.source.project.type = 'git';
                  break;
                case 'Git':
                  if (this.newProjectData.remoteUrl) {
                    factory.source.project.location = this.newProjectData.remoteUrl;
                  }
                  factory.source.project.type = 'git';
                  break;
                case 'Zip':
                  if (this.newProjectData.remoteUrl) {
                    factory.source.project.location = this.newProjectData.remoteUrl;
                  }
                  factory.source.project.type = 'zip';
                  break;
                case 'default':
                  return;
              }

              var response = Project.import(
                {
                  workspaceID: this.newProjectData.workspaceSelected.workspaceReference.id,
                  path: this.newProjectData.projectName
                },
                factory,
                function() {
                  ProjectFactory.fetchProjects(workspaces);
                }
              );
              $modalInstance.close();
          };
        }
    ]);