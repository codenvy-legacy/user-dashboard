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
    .controller('DashboardCtrl', function ($scope, $timeout, Workspace, Project, Users, Profile, $http, $window) {
        var old_description = '';
        $scope.box = 1;
        $scope.search = 0;
        $scope.projects = [];
        $scope.ownerWorkspace = '';
        $scope.members = [];
        
        Workspace.all(function (resp) {
            $scope.workspaces = _.filter(resp, function (workspace) {return !workspace.workspaceReference.temporary;});
            angular.forEach($scope.workspaces, function (value) {
                var urlGetMembers = $.map(value.links, function (obj) { if (obj.rel == "get members") return obj.href })[0];
                
                $http({ method: 'GET', url: urlGetMembers }).
                    success(function (data, status) {
                        angular.forEach(data, function(item) {
                            //var member = {};
                            //member.roles = item.roles;
                            //member.userId = item.userId;

                            Profile.getById(item.userId).then(function (data) {
                                var member = {
                                    fullName: data.attributes.firstName + " " + data.attributes.lastName,
                                    email: data.attributes.email,
                                    userId:item.userId,
                                    roles:item.roles
                                };
                                $scope.members.push(member);
                           });
                            
                        });
                    });
                

                $http({method: 'GET', url: $.map(value.workspaceReference.links,function(obj){if(obj.rel=="get projects") return obj.href})[0]}).
                    success(function (data, status) {
                        $scope.projects = $scope.projects.concat(data);
                    });
            });
        });

        $http({method: 'GET', url: '/api/account'}).success(function (account, status) {
          $scope.ownerWorkspace = _.pluck(_.pluck(account, 'accountReference'), 'name');
        });
        
        $scope.filter = {};

        var setPermissions = function(projectPermissions,member,role) {
            angular.forEach(projectPermissions, function (perm) {
                if (perm.principal.type == "GROUP" && perm.principal.name == role) {
                    member.permissions = perm.permissions;

                    angular.forEach(perm.permissions, function(currentPerm) {
                        if (currentPerm == 'read') {
                            member.read = true;
                        } else if (currentPerm ==  'write') {
                            member.write = true;
                        }
                    });


                } else if (perm.principal.type == "USER" && perm.principal.name == role) {
                    console.log("to be done!");
                }
            });
        };
        
        $scope.selectProject = function (project) {
            Project.getPermissions(project.workspaceId, project.name).then(function (data) { // get the permissions for the current selected project
                //var groupRoles;

                //angular.forEach(permissions, function(permissionItem) {
                //    if (permissionItem.principal.type == "GROUP") {
                //        var role = {
                //          name: permissionItem  
                //        };
                //    }else if (permissionItem.principal.type == "USER") {
                        
                //    }
                //});

                var projectPermissions = data;
                angular.forEach($scope.members, function (member) {
                    angular.forEach(member.roles, function (role) { // iterate users and their roles
                        //example roles for current user:
                        // 0: "workspace/admin"
                        // 1: "workspace/developer"
                        var projectPermissionsArray = $.map(projectPermissions, function (value, index) {
                            return [value];
                        });
                        setPermissions(projectPermissionsArray, member, role);
                    });
                });
            });
          
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
                $('.searchfield').focus();
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
