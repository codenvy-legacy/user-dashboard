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
    .controller('DashboardCtrl', function ($scope, $timeout, Workspace, Project, Users, Profile, $http, $q, $window, $location) {
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
          } else if (perm.principal.type === "GROUP" && member.roles.indexOf(perm.principal.name) !== -1) {
            setPermisionRules(perm, member);
          }
        });
      };

      var setPermisionRules = function (permission, member) {
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
        if (member.read == false) { // if user doesn't have read he can't write
          member.write = false;
        }
        
        var listPerm = [];

        if (member.read) {
          listPerm.push("read");
        }
        
        if (member.write) {
          listPerm.push("write");
        }
        return listPerm;
      };

      var getAdmin = function (roles) {
        if (roles.indexOf('workspace/admin') !== -1) {
          return true;
        } else {
          return false;
        }
      };

      var createMember = function (attributes, userId, read, write,roles) {
        var fullName;
        
        if (attributes.firstName && attributes.lastName) {
          fullName = attributes.firstName + " " + attributes.lastName;
        } else {
          fullName = attributes.email.split("@")[0];
        }

        var member = {
          fullName: fullName,
          email: attributes.email,
          userId: userId,
          read: read,
          write: write
        };
        
        if (roles) {
          member.roles = roles;
        }
        
        return member;
      };
      
      //public methods   
      $scope.selectProject = function (project) {
        $scope.emailList = '';
        $scope.activeMembers = [];

        $scope.showInviteError = false;
        $scope.currentWorkspace = _.find($scope.workspaces, function (workspace) {
          return workspace.workspaceReference.id == project.workspaceId;
        });

        $scope.isAdmin = getAdmin($scope.currentWorkspace.roles);
        $scope.activeMembers = angular.copy($scope.currentWorkspace.members);


        if ($scope.isAdmin) {
          Project.getPermissions(project.workspaceId, project.name).then(function (data) { // get the permissions for the current selected project
            var projectPermissions = data;
            var usersPermissions = [];
            var groupsPermissions = [];

            angular.forEach(projectPermissions, function (permission) {
              if (permission.principal.type === 'USER') {
                usersPermissions.push(permission);
              } else if (permission.principal.type === 'GROUP') {
                groupsPermissions.push(permission);
              }
            });

            angular.forEach($scope.activeMembers, function (member) {
              setPermissions(groupsPermissions, member);
              setPermissions(usersPermissions, member);
            });
          });
        } else {
          $http({ method: 'GET', url: '/api/profile' }).success(function (profile, status) {
            $scope.currentUser = {
              fullName: profile.attributes.firstName + " " + profile.attributes.lastName,
              email: profile.attributes.email,
              userId: profile.id,
              read: true,
              write: true
            };
          });
        }

        $scope.activeProject = project; // used in setRead setWrite
        $scope.selected = project;
        old_description = project.description;
      };
      $scope.updateProject = function () {
        return $q.all([
          $http({ method: 'POST', url: "/api/project/"+ $scope.selected.workspaceId+"/rename"+$scope.selected.path +"?name="+$scope.selected.name}).
              success(function (data, status, headers, config) {
                console.log(data);
              }),

          $http({ method: 'GET', url: "/api/project/"+ $scope.selected.workspaceId+"/"+$scope.selected.name}).
            success(function (data, status) {
              data.description = $scope.selected.description;
              $scope.updated = data;

          })
        ]).then(function (results) {
            $http({ method: 'PUT', url: "/api/project/"+ $scope.selected.workspaceId+"/"+$scope.selected.name, data: $scope.updated }).
              success(function (data, status) {
                //Change Project URL

                var projFound = $scope.projects.filter(function(p) {return p.name==data.name;})
                if(projFound.length > 0)
                {
                  projFound[0].ideUrl = data.ideUrl;
                }
                console.log(data);
            });
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

	  $scope.isProjectDataFetched = false;
	  $scope.isNeedToShowHelp = function() {
			if($scope.isProjectDataFetched)
				return $scope.projects==null || $scope.projects.length==0;
			else
				return false;
	  }
	    
	  $scope.selectMemberToBeDeleted = null;
	  $scope.setMemberToBeDeleted = function(member) {
		$scope.selectMemberToBeDeleted = member;
	  }
      $scope.removeMember = function (member) {
        Workspace.removeMember($scope.activeProject.workspaceId, member.userId).then(function (data) {
          var removedMemberIndex = -1;
          angular.forEach($scope.activeMembers, function (singleMember, index) {
            if (singleMember.userId === member.userId) {
              removedMemberIndex = index;
            }
          });
          if (removedMemberIndex > -1) {
            $scope.activeMembers.splice(removedMemberIndex, 1);
          }

          angular.forEach($scope.currentWorkspace.members, function (singleMember, index) {
            if (singleMember.userId === member.userId) {
              removedMemberIndex = index;
            }
          });
          if (removedMemberIndex > -1) {
            $scope.currentWorkspace.members.splice(removedMemberIndex, 1);
          }
        }, function (error) {
          console.log(error);
        });
      };

      $scope.showLoadingInvite = false;
      $scope.showInviteError = false;
      
      $scope.invite = function () {
        $scope.showLoadingInvite = true;
        $scope.errors = "";
        var tempEmailList = $scope.emailList;
        angular.forEach(tempEmailList.split(","), function (email) {
          Users.getUserByEmail(email).then(function (user) { // on success
            Workspace.addMemberToWorkspace($scope.activeProject.workspaceId, user.id).then(function () {
              // refresh member list
              Profile.getById(user.id).then(function (data) {
                var member = createMember(data.attributes, user.id, true, true);
                
                $scope.currentWorkspace.members.push(member);
                $scope.activeMembers.push(member);

                $scope.emailList = '';
                $scope.showLoadingInvite = false;
                $scope.showInviteError = false;
              });

            });
          }, function () {
            $scope.showInviteError = true;
            $scope.errors += email + " ,";
          });
        });
      };

	  $scope.getAllAdminListToDisplay = function() {
		//var selectedWorkspace = _.filter($scope.workspaces, function (workspace) { return !workspace.workspaceReference.id==workspaceId; });
		var listAdmins = [];
		angular.forEach($scope.currentWorkspace.members, function (tempmember) {
			if(tempmember.roles) {
				if(tempmember.roles.indexOf('workspace/admin')!=-1)
					listAdmins.push(tempmember.fullName);
			}
		});
		
		if(listAdmins.length == 1)
		{
			return 'is ' + listAdmins[0];
		}
		
		if(listAdmins.length > 1)
		{
			var strAdmins = '';
			for(var i=0;i<listAdmins.length;i++)
			{
				if(i==0)
					strAdmins += listAdmins[i];
				else if(listAdmins.length > 1 && (listAdmins.length-1)==i)
					strAdmins += ' and ' + listAdmins[i];
				else
					strAdmins +=  ', ' + listAdmins[i];
			}
			return 'are ' + strAdmins;
		}
		
		return '';
	  }
	  
	  
      //constructor
      var init = function () {
        Workspace.all(function (resp) {
		  $scope.workspaces = _.filter(resp, function (workspace) { return !workspace.workspaceReference.temporary; });
		
		  if($scope.workspaces.length==0) {
			  var tempWorkspaces = _.filter(resp, function (workspace) { return workspace.workspaceReference.temporary; });
			  if(tempWorkspaces.length > 0)
					$location.path("/login");
					
			  $scope.isProjectDataFetched = true;
		  }
        
		  $scope.projects = []; //clear the project list
		  
          angular.forEach($scope.workspaces, function (workspace) {
            workspace.members = [];

            Workspace.getMembersForWorkspace(workspace.workspaceReference.id).then(function (workspaceMembers) {
              angular.forEach(workspaceMembers, function (workspaceMember) {
                Profile.getById(workspaceMember.userId).then(function (data) {
                  var member = createMember(data.attributes, workspaceMember.userId,false,false, workspaceMember.roles)
                
                  workspace.members.push(member); // load the members for the workspace,
                });
              });
            });

            $http({ method: 'GET', url: $.map(workspace.workspaceReference.links, function (obj) { if (obj.rel == "get projects") return obj.href })[0] }).
                success(function (data, status) {
				  $scope.isProjectDataFetched = true;
                  $scope.projects = $scope.projects.concat(data);
                })
				.error(function (data, status) {
				  $scope.isProjectDataFetched = true;
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
