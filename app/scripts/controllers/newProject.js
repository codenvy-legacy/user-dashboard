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
        function(
            $scope,
            $timeout,
            $modalInstance,
            $filter,
            currentUserId,
            workspaces,
            type,
            Project,
            ProjectFactory) {

          this.workspaces = workspaces;
          this.currentUserId = currentUserId;
          this.tabActivated = {};
          this.tabActivated[type] = true;
          this.alerts = [];

          this.newProjectData = {
          };

          this.closeAlert = function(index) {
            this.alerts.splice(index, 1);
          };

          this.setProjectType = function(type) {
            if (this.newProjectData.remoteUrl) {
              if (type == 'Zip') {
                if (this.newProjectData.remoteUrl.match(new RegExp('^https?://github.com/.*$'))) {
                  this.newProjectData.remoteUrl = this.newProjectData.remoteUrl.replace(new RegExp('^(.*)\.git$'), '$1/archive/master.zip');
                }
              }
              if (type == 'GitHub' || type == 'Git') {
                if (this.newProjectData.remoteUrl.match(new RegExp('^https?://github.com/.*/archive/.*\.zip$'))) {
                  this.newProjectData.remoteUrl = this.newProjectData.remoteUrl.replace(new RegExp('^(.*)/archive/.*\.zip$'), '$1.git');
                }
              }
            }
            this.newProjectData.importType = type;
          };

          this.import = function() {
            this.alerts = [];

            var factory = {
              v: '2.0',
              source: {
                project: {
                  type: 'blank',
                  visibility: 'public'
                }
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

            var that = this;
            var response = Project.import(
              {
                workspaceID: this.newProjectData.workspaceSelected.workspaceReference.id,
                path: this.newProjectData.projectName
              },
              factory,
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
        }
    ]);