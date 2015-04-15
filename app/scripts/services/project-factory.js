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
    .factory('ProjectFactory', ['$http', '$q', 'RunnerService', function ($http, $q) {
        var ProjectFactory = {};

        ProjectFactory.isProjectDataFetched = false;
        ProjectFactory.projects = [];

        ProjectFactory.fetchProjects = function (workspaces, showLoading) {
            var projects = [];
            var workspaceCount = 0;
            var deferred = $q.defer();

            angular.forEach(workspaces, function (workspace) {
                $http({ method: 'GET', url: $.map(workspace.workspaceReference.links, function (obj) {
                    if (obj.rel == "get projects") return obj.href
                })[0], ignoreLoadingBar: !showLoading }).success(function (workspaceProjects) {
                    workspaceCount++;
                    projects = projects.concat(workspaceProjects);
                    if (workspaceCount == workspaces.length) {
                        ProjectFactory.isProjectDataFetched = !!projects.length;
                        updateProjectsData(projects);
                    }
                })
                    .error(function (data, status) {
                        workspaceCount++;
                        ProjectFactory.isProjectDataFetched = true;
                        if (workspaceCount == workspaces.length) {
                            updateProjectsData(projects);
                        }
                        deferred.reject();
                    });
            });

            var updateProjectsData = function (projects) {
                if (projects != null && projects.length) {
                    angular.forEach(projects, function (project) {
                        angular.forEach(project.problems, function (problem) {
                            if (problem.code == 1) {
                                project.description = 'This project does not have its language type and ' +
                                    'environment set yet. Open the project to configure it properly.';
                                project.type = 'mis-configured';
                                project.misconfigured = true;
                            }
                        });
                    });
                }
                if (!angular.equals(projects, ProjectFactory.projects)) {
                    // Empty the array keeping its reference (reason why = [] is not used).
                    while (ProjectFactory.projects.length) ProjectFactory.projects.pop();
                    ProjectFactory.projects.push.apply(ProjectFactory.projects, projects);
                }
                deferred.resolve();
            }
            return deferred.promise;
        };

        ProjectFactory.getSampleProject = function () {
            return {
                project: {
                    name: "getting-started-guided-tour",
                    visibility: "public",
                    mixinTypes: [
                        "GuidedTour"
                    ],
                    builders: {
                        default: "maven"
                    },
                    runners: {
                        default: "system:/java/web/tomcat7"
                    },
                    type: "maven",
                    attributes: {
                        language: ["java"],
                        codenvyGuidedTour: [
                            "https://gist.githubusercontent.com/slemeur/064dfe5615cc770735cc/raw/325f388aede82932d0db9de2d440c9521c1c65ff/welcome-guided-tour.json"
                        ] },
                    description: "Get started with Codenvy by following guided tour on this sample Spring application"
                },
                source: {
                    project: {
                        location: "https://github.com/spring-projects/spring-petclinic.git",
                        type: "git",
                        parameters: {
                            branch: "master"
                        }
                    }
                },
                actions: {
                    welcome: {
                        authenticated: {
                            title: "Discover",
                            contenturl: "https://dl.dropboxusercontent.com/u/2187905/Codenvy/PetClinic-Onboarding-Steps/welcome.html"
                        },
                        nonauthenticated: {
                            title: "Discover",
                            contenturl: "https://dl.dropboxusercontent.com/u/2187905/Codenvy/PetClinic-Onboarding-Steps/welcome.html"
                        }
                    }
                },
                creator: {
                    name: "Florent Benoit",
                    email: "florent.benoit@serli.com",
                    accountId: "accountya9vidwqbifhqd9p"
                },
                v: "2.0"
            }
        }

        return ProjectFactory;
    }]);
