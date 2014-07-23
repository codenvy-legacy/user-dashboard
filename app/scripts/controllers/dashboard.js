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
    .controller('DashboardCtrl', function ($scope, $timeout, Workspace, Project, Users, $http, $window) {
        var old_description = '';
        $scope.box = 1;
        $scope.search = 0;
        $scope.projects = [];
        $scope.ownerWorkspace = '';
        Workspace.all(function (resp) {
            $scope.workspaces = _.filter(resp, function (workspace) {return !workspace.workspaceReference.temporary;});
            angular.forEach($scope.workspaces, function (value) {
                $http({method: 'GET', url: $.map(value.workspaceReference.links,function(obj){if(obj.rel=="get projects") return obj.href})[0]}).
                    success(function (data, status) {
                        $scope.projects = $scope.projects.concat(data);
                    });
            });
        });
        
        Users.query().then(function (resp) {
          $scope.ownerWorkspace = resp[0].name;
        });

        $scope.filter = {};
        
        $scope.selectProject = function (project) {
          $scope.selected = project;
          old_description = project.description;
        };
        
        $scope.updateProject = function () {
            $http({method: 'PUT', url: $scope.selected.url, data: $scope.selected}).
                success(function (data, status) {
                console.log(data);
           });
        };

        $scope.switchVisibility = function () {
            $http({method: 'POST', url: '/api/project/'+$scope.selected.workspaceId+'/switch_visibility/'+$scope.selected.name+'?visibility='+$scope.selected.visibility}).
                success(function (data, status) {
                console.log(data);
           });
        };

        $scope.deleteProject = function () {
            $http({method: 'DELETE', url: $scope.selected.url}).
              success(function (status) {
                $scope.projects = _.without($scope.projects, _.findWhere($scope.projects,  $scope.selected));                
              });
        };
        
        $scope.cancelProject = function () {
          $scope.selected.description = old_description;
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
                $('.searchfull').animate({width: "43px" }, 400, function () { 
                  $('.searchfield').val('');
                  $('.searchfull').hide();
                });
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
