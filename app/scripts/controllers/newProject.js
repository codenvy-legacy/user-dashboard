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
        '$timeout',
        '$modalInstance',
        '$filter',
        'currentUserId',
        'workspaces',
        'type',
        'Project',
        'ProjectFactory',
        'ProjectGroups',
        function(
            $scope,
            $timeout,
            $modalInstance,
            $filter,
            currentUserId,
            workspaces,
            type,
            Project,
            ProjectFactory,
            ProjectGroups) {

          this.workspaces = workspaces;
          this.workspaceSelected = workspaces[0];
          this.projectGroups = [];
          this.currentUserId = currentUserId;
          this.tabActivated = {};
          this.tabActivated[type] = true;
          this.alerts = [];

          this.newProjectData = {
            source: {
              project: {
                location: '',
                type: ''
              }
            },
            project: {
              name: '',
              description: '',
              type: 'blank',
              visibility: 'public'
            }
          };

          this.closeAlert = function(index) {
            this.alerts.splice(index, 1);
          };

          this.setProjectType = function(type) {
            if (this.newProjectData.source.project.location) {
              if (type == 'Zip') {
                if (this.newProjectData.source.project.location.match(new RegExp('^https?://github.com/.*$'))) {
                  this.newProjectData.source.project.location = this.newProjectData.source.project.location.replace(new RegExp('^(.*)\.git$'), '$1/archive/master.zip');
                }
              }
              if (type == 'GitHub' || type == 'Git') {
                if (this.newProjectData.source.project.location.match(new RegExp('^https?://github.com/.*/archive/.*\.zip$'))) {
                  this.newProjectData.source.project.location = this.newProjectData.source.project.location.replace(new RegExp('^(.*)/archive/.*\.zip$'), '$1.git');
                }
              }
            }
            $scope.importType=type;

            switch (type) {
              case 'GitHub':
              case 'Git':
                this.newProjectData.project.type = 'null';
                this.newProjectData.source.project.type = 'git';
                break;
              case 'Zip':
                this.newProjectData.project.type = 'null';
                this.newProjectData.source.project.type = 'zip';
                break;
              default:
                this.newProjectData.project.type = 'blank';
                this.newProjectData.source.project.type = '';
                break;
            }
          };

          this.import = function() {
            this.alerts = [];

            if (!this.newProjectData.v) {
              this.newProjectData.v = '2.0';
            }

            var that = this;
            var response = Project.import(
              {
                workspaceID: this.workspaceSelected.workspaceReference.id,
                path: this.newProjectData.project.name
              },
              this.newProjectData,
              function() {
                that.alerts.push({type: 'success', msg: 'Successfully Done! Import process completed.'});

                $timeout(function() {
                  that.alerts = [];
                  ProjectFactory.fetchProjects(workspaces);
                  $modalInstance.close();
                }, 1500);
              },
              function(data) {
                that.alerts.push({type: 'danger', msg: 'Failed! Import failed: ' + data.data.message});
              }
            );
          };

          this.getProjectGroups = function() {
              var that = this;
              ProjectGroups.all().then(function (groups) {
                  that.projectGroups = groups;
              },
              function(error) {
                  that.alerts.push({type: 'danger', msg: 'Failed! Get project types failed: ' + error});
              });
          };
          this.getProjectGroups();
        }
    ]);