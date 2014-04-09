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
 * Controller for dashboard/projects
 */

/*global angular, $*/

'use strict';

angular.module('odeskApp')
    .controller('DashboardCtrl', function ($scope, $timeout, Workspace, Project, $http) {
        
        $scope.box = 1;
        $scope.search = 0;
        $scope.projects = [
            {
                "url" : "https://codenvy.com/api/project/workspace1q2w3e/Test-Project",
                "visibility" : "public",
                "projectTypeId" : "spring",
                "workspace" : "1q2w3e",
                "projectTypeName" : "Spring Application",
                "name" : "Test-Project",
                "description" : "This is my sample application"
            },
            {
                "url" : "https://codenvy.com/api/project/workspace1q2w3e/jar",
                "visibility" : "public",
                "projectTypeId" : "jar",
                "workspace" : "1q2w3e",
                "projectTypeName" : "Java Library (JAR)",
                "name" : "jar",
                "description" : "Test JAR"
            }
        ];
        
        
        Workspace.all(function (resp) {
            angular.forEach(resp, function (value) {
                $http({method: 'GET', url: value.workspaceRef.href}).
                    success(function (data, status) {
                        $http({method: 'GET', url: data.links[0].href}).
                            success(function (data1, status1) {
                                $scope.projects = $scope.projects.concat(data1);
                            });
                    });
            });
        });
        
        $scope.filter = {};
        
        $timeout(function () {
            $("[rel=tooltip]").tooltip({ placement: 'bottom'});
            $(document).on("click", ".searchfield", function () {
                $('.searchfull').show();
                $('.detail').animate({ opacity: 0}, 400);
                $('.searchfull').animate({width: "100%" }, 400, function () { $(".closeBtn").show(); });
            });
            $(document).on("click", ".closeBtn", function () {
                $(".closeBtn").hide();
                $('.detail').animate({ opacity: 1}, 400);
                $('.searchfull').animate({width: "43px" }, 400, function () { $('.searchfull').hide(); });
            });
        });
        
    });

angular.module('odeskApp')
        .directive('stopEvent', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.bind(attr.stopEvent, function (e) {
                    e.stopPropagation();
                });
            }
        };
    });
