/*jslint
    browser: true,
    devel:true ,
    node:true,
    nomen: true,
    es5:true
*/

/**
 * @auth Gaurav Meena
 * @author Oleksii Orel
 * @date 01/16/2014
 * Controller for dashboard/projects
 */

/*global angular, $, _*/

'use strict';

angular.module('odeskApp')
    .controller('DashboardCtrl', function ($scope, $rootScope, $cookieStore, $http, $q, $window, $interval, $timeout, $location,
                                           DocBoxService, Workspace, Project, Users, ProfileService, Password, ProjectFactory, RunnerService, newProject) {
      var refreshLocation = "/dashboard";
      var old_description = '';
      var old_projectName = '';
      var refreshInterval = null;

      $scope.box = 1;
      $scope.search = 0;
      $scope.projects = [];
      $scope.ownerWorkspace = '';
      $scope.members = [];
      $scope.filter = {};
      $scope.activeProject = null;
      $scope.activeMembers = [];
      $scope.workspaces = [];
      $scope.currentWorkspace = null;
      $scope.currentUserId = '';
      $scope.activeProjectVisibility = '';
      $scope.updateProjectError = '';
      $scope.deleteProjectError = '';

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

      var isRefreshLocation = function () {
          return $location.url() == refreshLocation;
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

      var createMember = function (attributes, userId, read, write, roles) {
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

       $scope.tempProject = {'name':'','description':''}; 
       
      //public methods
      $scope.selectProject = function(project,modalNameType) {

        $scope.tempProject.name = project.name;
        $scope.tempProject.description = project.description;
        $scope.emailList = '';
        $scope.activeMembers = [];

        $scope.showInviteError = false;
        $scope.activeProjectVisibility = project.visibility;
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


            ProfileService.getProfile().then(function (profile) {
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
        old_projectName = project.name;
      };

        var renameSelectedProject = function (newName) {
            RunnerService.getProcesses($scope.selected.workspaceId, $scope.selected.path, true)
                .then(function (runnerProcesses) {
                    var isActive = false;
                    angular.forEach(runnerProcesses, function (runnerProcess) {
                        if (runnerProcess.project==$scope.selected.path && runnerProcess.status=='RUNNING' || runnerProcess.status=='NEW') {
                            isActive = true;
                            return;
                        }
                    });
                    if (isActive) {
                        $scope.updateProjectError = 'We Cannot rename the running project';
                        $('#changeProjectDetailAlert .alert-danger').show();
                        $('#changeProjectDetailAlert .alert-danger').mouseout(function () {
                            $(this).fadeOut('slow');
                        });
                        $scope.selected.name = old_projectName;
                    } else {
                        Project.rename($scope.selected.workspaceId, $scope.selected.path, newName).then(function (data) {
                            var projectPath = "/" + newName;
                            Project.getProject($scope.selected.workspaceId, projectPath).then(function (data) {
                                angular.forEach($scope.projects, function (project, index) {
                                    if (project.path === $scope.selected.path) {
                                        $scope.projects[index]=data;
                                    }
                                });
                                $('#changeProjectDetailAlert .alert-danger').hide();
                                $('#changeProjectDetailAlert .alert-success').show();
                                $timeout(function () {
                                    $('#changeProjectDetailAlert .alert-success').hide();
                                    $('#projectDetailModal').modal('hide');
                                }, 1500);
                            }, function (error) {
                                $scope.updateProjectError = error.message ? error.message : 'Change project detail failed.';
                                $('#changeProjectDetailAlert .alert-danger').show();
                                $('#changeProjectDetailAlert .alert-danger').mouseout(function () {
                                    $(this).fadeOut('slow');
                                });
                            });
                        }, function (error) {
                            $scope.updateProjectError = error.message ? error.message : 'Change project detail failed.';
                            $('#changeProjectDetailAlert .alert-danger').show();
                            $('#changeProjectDetailAlert .alert-danger').mouseout(function () {
                                $(this).fadeOut('slow');
                            });
                        });
                    }
                }, function (error) {
                    $scope.updateProjectError = error.message ? error.message : 'Change project detail failed.';
                    $('#changeProjectDetailAlert .alert-danger').show();
                    $('#changeProjectDetailAlert .alert-danger').mouseout(function () {
                        $(this).fadeOut('slow');
                    });
                });
        };

        $scope.updateProject = function () {
            $('#changeProjectDetailAlert .alert-success').hide();
            $scope.selected.name = $scope.tempProject.name;
            $scope.selected.description = $scope.tempProject.description == '' ? null : $scope.tempProject.description;
            if ($scope.selected.name && $scope.selected.name.length > 0){
                var res = /[^0-9a-zA-Z\-._]/.test($scope.selected.name) || $scope.selected.name[0] == '-'
                    || $scope.selected.name[0] == '.' || $scope.selected.name[0] == '_';
                if (res) {
                    $scope.updateProjectError ='Project name must contain only Latin letters, digits or these following special characters -._';
                    $('#changeProjectDetailAlert .alert-danger').show();
                    $('#changeProjectDetailAlert .alert-danger').mouseout(function () {
                        $(this).fadeOut('slow');
                    });
                    $scope.selected.name = old_projectName;
                    return;
                }
                var isExistingName = true;
                angular.forEach($scope.projects, function (project) {
                    if ($scope.selected != project && $scope.selected.name == project.name) {
                        isExistingName = false;
                    }
                });
                if (!isExistingName) {
                    $scope.updateProjectError =" Impossible to rename the project. The name <b>"
                        + $scope.selected.name + '</b> is already used in your projects.';
                    $('#changeProjectDetailAlert .alert-danger span').html($scope.updateProjectError);
                    $('#changeProjectDetailAlert .alert-danger').show();
                    $('#changeProjectDetailAlert .alert-danger').mouseout(function () {
                        $(this).fadeOut('slow');
                    });
                    $scope.selected.name = old_projectName;
                    $scope.selected.description = old_description;
                    return;
                }
                if ($scope.selected.description != old_description) {
                    Project.getProject($scope.selected.workspaceId, $scope.selected.path).then(function (data) {
                        data.description = $scope.selected.description;
                        Project.setProject($scope.selected.workspaceId, $scope.selected.path, data).then(function (data) {
                            old_description = data.description;
                            if ($scope.selected.name != old_projectName){
                                renameSelectedProject($scope.selected.name);
                            } else {
                                $('#changeProjectDetailAlert .alert-danger').hide();
                                $('#changeProjectDetailAlert .alert-success').show();
                                $timeout(function () {
                                    $('#changeProjectDetailAlert .alert-success').hide();
                                    $('#projectDetailModal').modal('hide');
                                }, 1500);
                            }
                        }, function (error) {
                            $scope.selected.description = old_description;
                            $('#changeProjectDetailAlert .alert-success').hide();
                            $scope.updateProjectError = error.message ? error.message : 'Change project detail failed.';
                            $('#changeProjectDetailAlert .alert-danger').show();
                            $('#changeProjectDetailAlert .alert-danger').mouseout(function () {
                                $(this).fadeOut('slow');
                            });
                        });
                    });
                } else if ($scope.selected.name != old_projectName){
                    renameSelectedProject($scope.selected.name);
                }
            }
        };

      $scope.switchVisibility = function () {

        $http({ method: 'POST', url: '/api/project/' + $scope.selected.workspaceId + '/switch_visibility/' + $scope.selected.name + '?visibility=' +  $scope.activeProjectVisibility }).
            success(function (data, status) {
              $scope.selected.visibility = $scope.activeProjectVisibility;
              // console.log(data);
            });
      };

        $scope.setCurrentWorkspace = function (workspace) {
            if($scope.currentWorkspace && workspace && $scope.currentWorkspace.workspaceReference.name == workspace.workspaceReference.name) {
                return;
            }
            if (workspace) {
                $scope.filter.workspaceName = workspace.workspaceReference.name;
            } else {
                $scope.filter = {};
            }
            $scope.currentWorkspace = workspace;
            Workspace.currentWorkspace = workspace;
        };

	    $scope.deleteProjectConfirm = function() {
            $('#warning-project-alert .alert-success').hide();
            $('#warning-project-alert .alert-danger').hide();
            $('#warning-project').modal('show');
			  if($scope.isAdmin) {
                  $('#warning-project-message').html("Removing a project can't be undone, are you sure you want to continue?");
              } else {
                  $('#warning-project-message').html("Deleting the project requires Administrator permissions to the project's workspace. Contact Workspace Administrator or Owner.")
              }
       };

      $scope.deleteProject = function () {
          Project.delete($scope.selected).then(function () {
              $('#warning-project-alert .alert-success').show();
              ProjectFactory.fetchProjects($scope.workspaces);
              $scope.isProjectDataFetched = true;
              $timeout(function () {
                  $('#warning-project').modal('hide');
              }, 1500);
          }, function (error) {
              $('#warning-project-alert .alert-success').hide();
              $scope.deleteProjectError = error.message ? error.message : "Delete failed.";
              $('#warning-project-alert .alert-danger').show();
              $('#warning-project-alert .alert-danger').mouseout(function () { $(this).fadeOut('slow'); });
          });
      };

      // used to save permissions to server
      $scope.setReadWrite = function (member) {
        // update server
        var permissions = [{ "permissions": getPermisions(member), "principal": { "name": member.userId, "type": "USER" } }];

        Project.setPermissions($scope.activeProject.workspaceId, $scope.activeProject.name, permissions).then(function (data) {
          console.log("Successfully set permissions!");
        });
      };


      $scope.isProjectDataFetched = false;
      $scope.isNeedToShowHelp = function() {
      if($scope.isProjectDataFetched)
        return $scope.projects.length==0;
      else
        return false;
      };

	    $scope.selectMemberToBeDeleted = null;
	    $scope.setMemberToBeDeleted = function(member) {		    
            $scope.selectMemberToBeDeleted = member;
	    };


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

            // need to send to analytics an event
            var userInviteData = {
              params: {'WS':$scope.activeProject.workspaceId, "EMAIL": email}
            };
            var res = $http.post('/api/analytics/log/user-invite', userInviteData);
            
            Workspace.addMemberToWorkspace($scope.activeProject.workspaceId, user.id).then(function () {
              // refresh member list
                ProfileService.getProfileByUserId(user.id).then(function (data) {
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

      if($scope.currentWorkspace != null){
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
	  };
	  // for displaying message
      $scope.c2User='TRUE';
        ProfileService.getProfile().then(function (data) {
          $scope.userDetails=data.attributes;
      });

        ProfileService.getPreferences().then(function (data) {
          $scope.oldUser = data['codenvy:created'];
          $scope.c2User = data['codenvy:created'] != undefined ? 'TRUE' : 'FALSE';
      });

      // to show scheduled maintenance message from statuspage.io (Path-to service)
        $scope.scheduled = 'FALSE';
        $http({method: 'GET', url: '/dashboard/scheduled'}).success(function (data) {
            if (Array.isArray(data)) {
                if (data.length) {
                    $scope.data = data;
                    $scope.scheduled = 'TRUE';
                }
            }
        }).error(function (err) {
        });

      $scope.definePassword = function () {
          var password = $('#newPassword').val();
          if (password === $('#newPasswordVerify').val()) {
              $('#defineUserPassword #doesNotMatch').hide();
              $('#newPassword').css('border', '1px solid #e5e5e5');
              $('#newPasswordVerify').css('border', '1px solid #e5e5e5');
              Password.update(password).then(function (data) {
                  $timeout(function () {
                      $('#defineUserPassword').modal('hide');
                  }, 1500);
              });
              ProfileService.getPreferences().then(function (data) {
                  if (data.resetPassword && data.resetPassword == "true") {
                      ProfileService.updatePreferences({'resetPassword': 'false'});
                      $cookieStore.remove('resetPassword');
                  }
              });
          } else {
              $('#defineUserPassword #doesNotMatch').show();
              $('#defineUserPassword #doesNotMatch').mouseout(function () {
                  $(this).fadeOut('slow');
              });
              $('#newPassword').css('border', '1px solid #a94442');
              $('#newPasswordVerify').css('border', '1px solid #a94442');
          }
      };


      $scope.createSampleProject = function(workspaceId) {
          var projectName = "getting-started-guided-tour";
          return Project.import(
              {
                  workspaceID: workspaceId,
                  path: projectName
              },
              ProjectFactory.getSampleProject(),
              function() {
                  ProjectFactory.fetchProjects($scope.workspaces, true);
                  ProfileService.updatePreferences({"sampleProjectCreated": 'true'});
              }
          );
      };

      $scope.importNewProject = function (type) {
          var promise = newProject.open($scope.currentUserId, $scope.workspaces, type);
      };

        var updateInterval = function (time) {
            if (refreshInterval != null) {
                if($interval.cancel(refreshInterval)){
                    refreshInterval = null;
                }
            }
            if (time != null && refreshInterval == null) {
                refreshInterval = $interval(function () {
                        ProjectFactory.fetchProjects($scope.workspaces, false);
                }, time);
            }
        };

      //constructor
        var init = function () {
          $scope.hideDocBox = function(item) {
            DocBoxService.hideDocBox(item);
            $scope.docboxes = DocBoxService.getDocBoxes();
          };
            $scope.currentWorkspace = Workspace.currentWorkspace;
            if ($scope.currentWorkspace) {
                $scope.filter.workspaceName = $scope.currentWorkspace.workspaceReference.name;
            } else {
                $scope.filter = {};
            }

            $http({ method: 'GET', url: '/api/account' }).success(function (account, status) {
                $scope.ownerWorkspace = _.pluck(_.pluck(account, 'accountReference'), 'name');
                $scope.currentUserId = account[0].userId;
            });

            Workspace.all(true).then(function (resp) {
                $scope.workspaces = Workspace.workspaces;

                if (!$scope.workspaces.length) {
                    var tempWorkspaces = _.filter(resp, function (workspace) {
                        return workspace.workspaceReference.temporary;
                    });
                    if (tempWorkspaces.length) {
                        $window.location.href = '/site/login';
                        $scope.isProjectDataFetched = true;
                    }
                }
                $scope.projects = ProjectFactory.projects;

                ProfileService.getPreferences().then(function (data) {
                    if (data.resetPassword && data.resetPassword == 'true') {
                        if ($cookieStore.get('resetPassword') != $scope.currentUserId) {
                            $cookieStore.put('resetPassword', $scope.currentUserId);
                            $('#defineUserPassword').modal('toggle'); // show once per session
                        }
                    }

                    //Check for sample project creation (if created - "sampleProjectCreated" attribute is set):
                    if (!data.sampleProjectCreated || data.sampleProjectCreated == "false") {
                        var projects = Project.query({
                            workspaceID: $scope.workspaces[0].workspaceReference.id
                        }, function (projects) {
                            var featureStartPoint = new Date(1420070400000); //01-01-2015 (timestamp in UTC 1420070400)
                            var afterFeatureStarted = featureStartPoint < new Date(parseInt(data["codenvy:created"]));
                            if (projects.length == 0 && afterFeatureStarted) {
                                $scope.createSampleProject($scope.workspaces[0].workspaceReference.id);
                            } else {
                                ProjectFactory.fetchProjects($scope.workspaces, true);
                            }
                        });
                    } else {
                        ProjectFactory.fetchProjects($scope.workspaces, true);
                    }
                });


                angular.forEach($scope.workspaces, function (workspace) {
                    workspace.members = [];
                    Workspace.getMembersForWorkspace(workspace.workspaceReference.id).then(function (workspaceMembers) {
                        angular.forEach(workspaceMembers, function (workspaceMember) {
                            ProfileService.getProfileByUserId(workspaceMember.userId).then(function (data) {
                                var member = createMember(data.attributes, workspaceMember.userId, false, false, workspaceMember.roles)
                                workspace.members.push(member); // load the members for the workspace,
                            });
                        });
                    });
                });
            });

            $timeout(function () {
                $("[rel=tooltip]").tooltip({ placement: 'bottom' });
                $(document).on("click", ".searchfield", function () {
                    $('.searchfull').show();
                    $('.detail').animate({ opacity: 0 }, 400);
                    $('.searchfull').animate({ width: "100%" }, 400, function () {
                        $(".closeBtn").show();
                    });
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
            updateInterval(90000);// update the projects every 90 seconds
        };
        init();// all code starts here

        $rootScope.$on('$locationChangeStart', function () {
            if (!isRefreshLocation()) {
                if (refreshInterval != null) {
                    if ($interval.cancel(refreshInterval)) {
                        refreshInterval = null;
                    }
                }
            }
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
