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

// This is the factory design pattern described here http://toddmotto.com/rethinking-angular-js-controllers/
// It provides numerous advantages:
//  * it removes all model related logic from the controller,
//  * it gives a global model (not limited to the the controller),
//  * it gives the ability to refresh it from anywhere by calling directly the factory.
angular.module('odeskApp')
    .factory('ProjectFactory', ['$http', function($http) {
      var ProjectFactory = {};

      ProjectFactory.isProjectDataFetched = false;
      ProjectFactory.projects = [];

      ProjectFactory.fetchProjects = function(workspaces) {
        // Empty the array keeping its reference (reason why = [] is not used).
        while (ProjectFactory.projects.length) ProjectFactory.projects.pop();

        angular.forEach(workspaces, function (workspace) {
          $http({ method: 'GET', url: $.map(workspace.workspaceReference.links, function (obj) { if (obj.rel == "get projects") return obj.href })[0] })
              .success(function (data, status) {
                // Same for not losing reference to primary array
                ProjectFactory.projects.push.apply(ProjectFactory.projects, data);
                ProjectFactory.isProjectDataFetched = !!ProjectFactory.projects.length;

                angular.forEach(ProjectFactory.projects , function (project){
                  if(project.problems.length){
                    angular.forEach(project.problems, function(problem){
                      if(problem.code == 1) {
                        project.description = 'This project does not have its language type and environment set yet. Open the project to configure it properly.';
                        project.type='mis-configured';
                        project.misconfigured = true;
                      }
                    });
                  }
                });
              })
              .error(function (data, status) {
                ProjectFactory.isProjectDataFetched = true;
              });
        });
      };

      return ProjectFactory;
    }]);