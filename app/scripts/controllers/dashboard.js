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
        $scope.filter = {};
        $scope.activeProject = null;
        $scope.activeMembers = [];
        $scope.workspaces = [];
        $scope.currentUserId = '';

        //private methods
        // for one user set the read write properties
        var setPermissions = function (projectPermissions, member) {
            angular.forEach(projectPermissions, function (perm) {
                if (perm.principal.type === "USER" && perm.principal.name === member.userId) {
                    setPermisionRules(perm, member);
                } else if ( perm.principal.type === "GROUP" && member.roles.indexOf(perm.principal.name) !== -1 ) {
                    setPermisionRules(perm, member);
                }
            });
        };
        
        var setPermisionRules = function(permission, member){
            member.read = false;
            member.write = false;
            member.permissions = permission.permissions;
            
            angular.forEach(permission.permissions, function (currentPerm) {
                if (currentPerm == 'read') {
                    member.read = true;
                } else if (currentPerm == 'write') {
                    member.write = true;
                }
            });
        };

        // Returns an array of selected permisions for given member
        var getPermisions = function (member) {
            var listPerm = [];
            if (member.read)
                listPerm.push("read");
            if (member.write)
                listPerm.push("write");
            return listPerm;
        };

        var getAdmin = function (roles) {
            if (roles.indexOf('workspace/admin') !== -1) {
                return true;
            } else {
                return false;
            }
        };
        
        //public methods   
        $scope.modalManageProject = " #developersModal";

        $scope.selectProject = function (project) {
            $scope.activeMembers = [];
            
            $scope.showInviteError = false;
            var currentWorkspace = _.find($scope.workspaces, function (workspace) {
                return workspace.workspaceReference.id == project.workspaceId;
            });

            $scope.isAdmin = getAdmin(currentWorkspace.roles);
            $scope.activeMembers = angular.copy(currentWorkspace.members);

            Project.getPermissions(project.workspaceId, project.name).then(function (data) { // get the permissions for the current selected project
                var projectPermissions = data;
                var usersPermissions = [];
                var groupsPermissions = [];
                
                angular.forEach(projectPermissions, function(permission){
                    if ( permission.principal.type === 'USER' ) {
                        usersPermissions.push(permission);
                    } else if ( permission.principal.type === 'GROUP' ) {
                        groupsPermissions.push(permission);
                    }
                });
                
                angular.forEach($scope.activeMembers, function (member) {
                    setPermissions(groupsPermissions, member);
                    setPermissions(usersPermissions, member);
                });
            });

            $scope.activeProject = project; // used in setRead setWrite
            $scope.selected = project;
            old_description = project.description;
        };

        $scope.updateProject = function () {
            $http({ method: 'PUT', url: $scope.selected.url, data: $scope.selected }).
                success(function (data, status) {
                    console.log(data);
                });
        };

        $scope.switchVisibility = function () {
            $http({ method: 'POST', url: '/api/project/' + $scope.selected.workspaceId + '/switch_visibility/' + $scope.selected.name + '?visibility=' + $scope.selected.visibility }).
                success(function (data, status) {
                    console.log(data);
                });
        };

        $scope.deleteProject = function () {
            $http({ method: 'DELETE', url: $scope.selected.url }).
              success(function (status) {
                  $scope.projects = _.without($scope.projects, _.findWhere($scope.projects, $scope.selected));
              });
        };

        $scope.cancelProject = function () {
            $scope.selected.description = old_description;
        };

        // used to save permissions to server
        $scope.setReadWrite = function (member) {
            // update server
            var permissions = [{ "permissions": getPermisions(member), "principal": { "name": member.userId, "type": "USER" } }];

            Project.setPermissions($scope.activeProject.workspaceId, $scope.activeProject.name, permissions).then(function (data) {
                console.log("Successfully set permisions!");
            });
        };
        
        $scope.removeMember = function (member) {
            Workspace.removeMember($scope.activeProject.workspaceId, member.userId).then(function (data) {
                var removedMemberIndex = -1
                angular.forEach( $scope.activeMembers, function( singleMember, index ) {
                    if (singleMember.userId === member.userId) {
                        removedMemberIndex = index;
                    }
                });
                if (removedMemberIndex > -1) {
                    $scope.activeMembers.splice(removedMemberIndex, 1);
                }
            }, function (error) {
                console.log(error);
            });
        };

        $scope.invite = function () {
            $scope.errors = "";

            angular.forEach($scope.emailList.split(";"), function (email) {
                Users.getUserByEmail(email).then(function (user) { // on success
                    Workspace.addMemberToWorkspace($scope.activeProject.workspaceId, user.id);
                }, function (error) {
                    $scope.showInviteError = true;
                    $scope.errors += email + " ,";
                });
            });
        };
        //constructor
        var init = function () {
            Workspace.all(function (resp) {
                $scope.workspaces = _.filter(resp, function (workspace) { return !workspace.workspaceReference.temporary; });

                angular.forEach($scope.workspaces, function (workspace) {
                    workspace.members = [];

                    Workspace.getMembersForWorkspace(workspace.workspaceReference.id).then(function (workspaceMembers) {
                        angular.forEach(workspaceMembers, function (workspaceMember) {
                            Profile.getById(workspaceMember.userId).then(function (data) {
                                var member = {
                                    fullName: data.attributes.firstName + " " + data.attributes.lastName,
                                    email: data.attributes.email,
                                    userId: workspaceMember.userId,
                                    roles: workspaceMember.roles
                                };
                                workspace.members.push(member); // load the members for the workspace,
                            });
                        });
                    });

                    //var urlGetMembers = $.map(value.links, function (obj) { if (obj.rel == "get members") return obj.href })[0];

                    //$http({ method: 'GET', url: urlGetMembers }).
                    //    success(function (data, status) {
                    //        angular.forEach(data, function (item) {
                    //            //var member = {};
                    //            //member.roles = item.roles;
                    //            //member.userId = item.userId;

                    //            Profile.getById(item.userId).then(function (data) {
                    //                var member = {
                    //                    fullName: data.attributes.firstName + " " + data.attributes.lastName,
                    //                    email: data.attributes.email,
                    //                    userId: item.userId,
                    //                    roles: item.roles
                    //                };
                    //                $scope.members.push(member);
                    //            });

                    //        });
                    //    });


                    $http({ method: 'GET', url: $.map(workspace.workspaceReference.links, function (obj) { if (obj.rel == "get projects") return obj.href })[0] }).
                        success(function (data, status) {
                            $scope.projects = $scope.projects.concat(data);
                        });
                });
            });

            $http({ method: 'GET', url: '/api/account' }).success(function (account, status) {
                $scope.ownerWorkspace = _.pluck(_.pluck(account, 'accountReference'), 'name');
                $scope.currentUserId = account[0].userId;
            });

            $timeout(function () {
                $("[rel=tooltip]").tooltip({ placement: 'bottom' });
                $(document).on("click", ".searchfield", function () {
                    $('.searchfull').show();
                    $('.detail').animate({ opacity: 0 }, 400);
                    $('.searchfull').animate({ width: "100%" }, 400, function () { $(".closeBtn").show(); });
                    $('.searchfield').focus();
                });
                $(document).on("click", ".closeBtn", function () {
                    $(".closeBtn").hide();
                    $('.detail').animate({ opacity: 1 }, 400);
                    $('.searchfull').animate({ width: "43px" }, 400, function () {
                        $('.searchfield').val('');
                        $('.searchfull').hide();
                    });
                });
            });

        };
        init(); // all code starts here
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
