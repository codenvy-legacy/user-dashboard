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
        var projectsJSON = null;

        ProjectFactory.isProjectDataFetched = false;
        ProjectFactory.projects = [];

        ProjectFactory.fetchProjects = function(workspaces) {
            var projects = [];

            angular.forEach(workspaces, function (workspace, currentIndex) {
                var lastIndex = workspaces.length - 1;
                $http({ method: 'GET', url: $.map(workspace.workspaceReference.links, function (obj) { if (obj.rel == "get projects") return obj.href })[0] })
                    .success(function (data, status) {
                        projects = projects.concat(data);
                        if(currentIndex == lastIndex){
                            updateProjectsData(projects);
                        }
                    })
                    .error(function (data, status) {
                        ProjectFactory.isProjectDataFetched = true;
                        if(currentIndex == lastIndex){
                            updateProjectsData(projects);
                        }
                    });
            });

            var updateProjectsData = function (projects) {
                if (projectsJSON == null || projectsJSON != JSON.stringify(projects)) {
                    projectsJSON = JSON.stringify(projects);
                    if(!ProjectFactory.isProjectDataFetched) {
                        ProjectFactory.isProjectDataFetched = !!projects.length;
                    }
                    angular.forEach(projects , function (project){
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
                    while (ProjectFactory.projects.length) ProjectFactory.projects.pop();
                    ProjectFactory.projects.push.apply(ProjectFactory.projects, projects);
                }
            }
        };

        return ProjectFactory;
    }]);
