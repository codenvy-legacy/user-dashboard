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
	    var old_projectname = '';
 
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
      $scope.changeName ='';
      $scope.timer = '';    

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
      $scope.selectProject = function(project,modalNameType) {
        clearInterval($scope.timer);
        $("#renameProjectError").hide();
        $scope.emailList = '';
        $scope.activeMembers = [];

        $scope.showInviteError = false;
        $scope.currentWorkspace = _.find($scope.workspaces, function (workspace) {
          return workspace.workspaceReference.id == project.workspaceId;
        });

        $scope.isAdmin = getAdmin($scope.currentWorkspace.roles);
        $scope.activeMembers = angular.copy($scope.currentWorkspace.members);

        if($scope.isAdmin) {

          if (modalNameType=='privacysetting'){
            $('#privacyModal').modal('toggle');
          }
          else if(modalNameType=='developersetting'){
            $('#developersModal').modal('toggle');
          }
          else if(modalNameType=='projectsetting'){
            $('#projectDetailModal').modal('toggle');
          }

          Project.getPermissions(project.workspaceId, project.name).then(function (data) { // get the permissions for the current selected project
            var projectPermissions = data;
            var usersPermissions = [];
            var groupsPermissions = [];

            angular.forEach(projectPermissions, function (permission) {
              if (permission.principal.type === 'USER') {
                usersPermissions.push(permission);
              } 
              else if (permission.principal.type === 'GROUP') {
                groupsPermissions.push(permission);
              }
            });

            angular.forEach($scope.activeMembers, function (member) {
              setPermissions(groupsPermissions, member);
              setPermissions(usersPermissions, member);
            });
          });
        } else {

            if (modalNameType=='privacysetting') {
              $('#privacyMessageModal').modal('toggle');
            }
            else if(modalNameType=='developersetting'){
              $('#developersModal').modal('toggle');
            }
            else if(modalNameType=='projectsetting'){
            $('#projectDetailModal').modal('toggle');
            }


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
		    old_projectname = project.name;
      
      };


      $scope.updateProject = function () {
        intervalReload();
        if($scope.selected.name && $scope.selected.name.length > 0)
        {
        var res = /[^0-9a-zA-Z\-._]/.test($scope.selected.name) || $scope.selected.name[0] == '-' || $scope.selected.name[0] == '.' || $scope.selected.name[0] == '_';
          if(res)
          {  
          alert('Project name must contain only Latin letters, digits or these following special characters -._');
          $scope.selected.name = old_projectname;
          return;
          }
          $scope.profound = 0;
          angular.forEach($scope.projects , function (project) {
            if($scope.selected.name==project.name) {
              $scope.profound+=1;   
          }
         });
     
          if($scope.profound>1) {
            $scope.changeName = $scope.selected.name;
            $scope.selected.name = old_projectname;
          }

        }
        return $q.all([
          $http({ method: 'POST', url: "/api/project/"+ $scope.selected.workspaceId+"/rename"+$scope.selected.path +"?name="+$scope.selected.name}).
            success(function (data, status, headers, config) {
               
              }).error(function (err) {
                  $('.modal-backdrop').remove();
                  alert(err.message);
              })
        ]).then(function (results) {

           if($scope.selected.misconfigured == undefined || $scope.selected.misconfigured == false) {
              $http({ method: 'GET', url: "/api/project/"+ $scope.selected.workspaceId+"/"+$scope.selected.name}).
                success(function (data, status) {
                  data.description = $scope.selected.description;
                  $scope.updated = data;

                  $http({ method: 'PUT', url: "/api/project/"+ $scope.selected.workspaceId+"/"+$scope.selected.name, data: $scope.updated }).
                    success(function (data, status) {
                                  //Change Project URL & Path
                      $('#projectDetailModal').modal('hide');
                      $('.modal-backdrop').remove();
                      var projFound = $scope.projects.filter(function(p) {return p.name==data.name;})
                      if(projFound.length > 0)
                        {
                          projFound[0].ideUrl = data.ideUrl;
                          projFound[0].path = data.path;
                        }

                      });
                    })
            }
           });

      };

      $scope.cancelPopup = function () {
        intervalReload();
      };

      $scope.switchVisibility = function () {
        intervalReload();
        $http({ method: 'POST', url: '/api/project/' + $scope.selected.workspaceId + '/switch_visibility/' + $scope.selected.name + '?visibility=' + $scope.selected.visibility }).
          success(function (data, status) {
  
          });
     
      };

	    $scope.deleteProjectConfirm = function() {
        intervalReload();
			  if($scope.isAdmin)
				$('#warning-project').modal('show');
			  else
				alert("Deleting the project requires Administrator permissions to the project's workspace. Contact the workspace's Administrator or Owner.");
	      
       };

      $scope.deleteProject = function () {
        intervalReload();
        $http({ method: 'DELETE', url: $scope.selected.url }).
          success(function (status) {
            $scope.projects = _.without($scope.projects, _.findWhere($scope.projects, $scope.selected));        
            if($scope.projects.length==0){
                    $scope.isProjectDataFetched = true;
                  }          
          });
          
      };

      $scope.cancelProject = function () {
        $scope.selected.description = old_description;
		    $scope.selected.name = old_projectname;
        intervalReload();
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
        return $scope.projects.length==0;
      else
        return false;
      }

	    $scope.selectMemberToBeDeleted = null;
	    $scope.setMemberToBeDeleted = function(member) {		    
        $scope.selectMemberToBeDeleted = member;
	    }
 
      $scope.removeMember = function (member) {
        clearInterval($scope.timer);
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
          
        });
      
      };

      $scope.showLoadingInvite = false;
      $scope.showInviteError = false;

      $scope.invite = function () {
        clearInterval($scope.timer);
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
			if($scope.errors.length!==0)
				$scope.errors += ", " + email;
			else
				$scope.errors += email;
          });
        });
      };

	  $scope.getAllAdminListToDisplay = function() {
      //var selectedWorkspace = _.filter($scope.workspaces, function (workspace) { return !workspace.workspaceReference.id==workspaceId; });
      var listAdmins = [];

      if(typeof($scope.currentWorkspace)!="undefined"){
        angular.forEach($scope.currentWorkspace.members, function (tempmember) {
          if (tempmember.roles) {
            if (tempmember.roles.indexOf('workspace/admin') != -1)
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
      }

      return '';
	  }
	  // for displaying message
      $scope.c2User='TRUE';
      $http({method: 'GET', url: '/api/profile/'}).success(function(data){
          $scope.userDetails=data.attributes;
          $scope.oldUser = data.attributes['codenvy:created'];

          if(data.attributes['codenvy:created']!=undefined){$scope.c2User='TRUE';}else{$scope.c2User='FALSE';}

      }).error(function(err){

      });



      //constructor
      var init = function () {

      
      Workspace.all(function (resp) {
 
		  $scope.workspaces = _.filter(resp, function (workspace) { return !workspace.workspaceReference.temporary; });

		  if($scope.workspaces.length==0) {
			  var tempWorkspaces = _.filter(resp, function (workspace) { return workspace.workspaceReference.temporary; });
			  if(tempWorkspaces.length > 0)
					$window.location.href = '/site/login';

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

              $http({ method: 'GET', url: $.map(workspace.workspaceReference.links, function (obj) { if (obj.rel == "get projects") return obj.href })[0] })
              .success(function (data, status) {
                  $scope.projects = $scope.projects.concat(data);
                  if($scope.projects.length==0) {
                    $scope.isProjectDataFetched = true;
                  }
                  else {
                    $scope.isProjectDataFetched = false; 
                  }
                  angular.forEach($scope.projects , function (project){
                          if(project.problems.length>0){
                         angular.forEach(project.problems,function(problem){
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
      var intervalReload = function() {
        clearInterval($scope.timer);
        $scope.isProjectDataFetched = false;
        $scope.timer = setInterval(function() {$scope.$apply(init);},20000);
        };


      init();// all code starts here 
      intervalReload(); // automatic refresh of project list
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
