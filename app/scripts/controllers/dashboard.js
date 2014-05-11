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

/*global angular, $, _*/

'use strict';

angular.module('odeskApp')
    .controller('DashboardCtrl', function ($scope, $timeout, Workspace, Project, $http, $window) {
        
        $scope.box = 1;
        $scope.search = 0;
        $scope.projects = [];
        
        
        Workspace.all(function (resp) {
            $scope.workspaces = _.filter(resp, function (workspace) { return !workspace.workspaceRef.temporary; });
            angular.forEach($scope.workspaces, function (value) {
                $http({method: 'GET', url: value.workspaceRef.workspaceLink.href}).
                    success(function (data, status) {
                        $http({method: 'GET', url: data.links[0].href}).
                            success(function (data1, status1) {
                                $scope.projects = $scope.projects.concat(data1);
                            });
                    });
				
            });
        });
        
        $scope.filter = {};
        
        $scope.gotoProject = function () {
            $window.location.href = '/ide/' + $scope.workspaces[0].workspaceRef.name + '/new_project';
        };
        
        $scope.selectProject = function (project) {
            
            $scope.selected = project;
            
        };
        
        $scope.updateProject = function () {
            $http({method: 'PUT', url: $scope.selected.url, data: $scope.selected}).
                success(function (data, status) {
                    console.log(data);
                });
        };
        
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
