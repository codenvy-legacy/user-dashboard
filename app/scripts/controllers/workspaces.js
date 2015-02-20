/*jslint
 browser: true,
 devel:true ,
 node:true,
 nomen: true,
 es5:true
 */

/**
 * @auth Gaurav Meena
 * @date 03/23/2014
 * Controller for workspaces
 */

/*global angular, $*/
'use strict';

angular.module('odeskApp')
    .controller('WorkspacesCtrl', function ($scope, Account, OrgAddon, WorkspaceInfo, Workspace, $http, $q, $timeout) {
        $scope.$on('orgAddonDataUpdated', function () {
            $scope.accounts = OrgAddon.accounts;
            $scope.isOrgAddOn = OrgAddon.isOrgAddOn;
            $scope.currentAccount = OrgAddon.currentAccount;
        });

        $scope.$on('orgAddonUpdateCurrentAccount', function () {
            $scope.currentAccount = OrgAddon.currentAccount;
            $scope.loadWorkspaceInfo();
        });

        $scope.init = function () {
            if (OrgAddon.isOrgAddOn) {
                $scope.isOrgAddOn = OrgAddon.isOrgAddOn;
                $scope.accounts = OrgAddon.accounts;
                $scope.currentAccount = OrgAddon.currentAccount;
                $scope.loadWorkspaceInfo();

                // For search
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

            } else {
                window.location = "/#/dashboard";
            }
        };

        $scope.updateFreeEmails = function () {
            var freeEmails = [];
            var usedEmails = [];

            angular.forEach($scope.selectedWsMembers, function (member) {
                usedEmails.push(member.email);
            });
            if($scope.userAlreadyAdded !== null){
                usedEmails = usedEmails.concat($scope.userAlreadyAdded);
            }

            var members = $scope.members;

            angular.forEach(members, function (member) {
                if(usedEmails.indexOf(member.email) == -1) {
                    freeEmails.push({id: member.email, text: member.email});
                }
            });

            $("#selectedMembers").select2({
                placeholder: "User(s) email",
                multiple: true,
                formatNoMatches: function() {
                    return 'No member to add';
                },
                data: freeEmails
            });
        };

        $scope.loadWorkspaceInfo = function () {
            $scope.workspaces = [];
            $scope.members = [];
            $scope.selectedMembers = [];
            $scope.selectedWsMembers = [];


            $scope.defineProperValue = false;
            $scope.primaryWorkspace = {'name': ''};

            // Display workspace details in workspace
            $http({method: 'GET', url: '/api/workspace/find/account?id=' + $scope.currentAccount.id})
                .success(function (workspaces) {

                    angular.forEach(workspaces, function (workspace) {
                        //  Get workspace's projects and developers using workspace id
                        WorkspaceInfo.getDetail(workspace.id).then(function (response) {

                            var projectsLength = 0;
                            var projectsName;
                            var membersLength = 0;
                            var allocatedRam;
                            var promises = [];
                            if (workspace.attributes['codenvy:role'] != 'extra') {
                                $scope.primaryWorkspace.name = workspace.name;
                            }
                            var getProjectsURL = _.find(response.links, function (obj) {
                                return obj.rel == "get projects"
                            });
                            if (getProjectsURL !== undefined) {
                                promises.push(
                                    $http({method: getProjectsURL.method, url: getProjectsURL.href})
                                        .success(function (data) {
                                            projectsName = _.pluck(data, 'name');
                                            projectsLength = data.length;
                                        }));
                            }

                            promises.push(
                                $http({method: 'GET', url: "/api/workspace/" + workspace.id + "/members" })
                                    .success(function (data) {
                                        membersLength = data.length;
                                    }));

                            promises.push(
                                $http({method: 'GET', url: "/api/runner/" + workspace.id + "/resources" })
                                    .success(function (data) {
                                        allocatedRam = data.totalMemory;
                                    }));

                            return $q.all(promises).then(function (results) {
                                var workspaceDetails = {
                                    id: workspace.id,
                                    name: workspace.name,
                                    allocatedRam: allocatedRam,
                                    projects: projectsLength,
                                    projectsName: projectsName,
                                    developers: membersLength
                                }

                                $scope.workspaces.push(workspaceDetails);
                            });
                        });
                    });
                })
                .error(function (err) {
                });
        };

        if (OrgAddon.accounts.length > 0) {
            $scope.init();
        } else {
            return OrgAddon.getOrgAccounts().then(function () {
                $scope.init();
            });
        }

        //Add members to workspace list
        $scope.addMemberToWsList = function () {
            var selectedMembers = $("#selectedMembers").val();
            var selectedMemberEmails = selectedMembers.split(",");
            var role = $("input[name=ws_member_role]:checked").val();

            $("#userAlreadyAdded").hide();
            $("#emptyEmails").hide();
            $("#addMemberErr").hide();
            $("#wsAlreadyExist").hide();

            $scope.userNotFoundList = [];
            $scope.userNotMemberList = [];
            $scope.userAlreadyAdded = [];

            if (selectedMembers.length > 0) {
                $("#ws_name").parent().removeClass('has-error');
                $("#emptyWs").hide();
                $("#selectedMembers").parent().removeClass('has-error');
                $("#emptyEmails").hide();
                angular.forEach(selectedMemberEmails, function (memberEmail) {
                    var email, name, userId;
                    return $q.all([
                        $http({method: 'GET', url: '/api/user/find', params: {email: memberEmail}})
                            .success(function (data) {
                                userId = data["id"]
                            })
                            .error(function (err) {
                                $scope.userNotFoundList.push(memberEmail);
                            })

                    ]).then(function (results) {

                        var foundMember = _.find($scope.members, function (member) {
                            if (member.id == userId) return member;
                        });
                        var index = $scope.members.indexOf(foundMember);
                        if (index != -1) {
                            var alreadyAddedMember = _.find($scope.selectedWsMembers, function (member) {
                                if (member.id == userId) return member;
                            });
                            if (typeof(alreadyAddedMember) != "undefined") {
                                $scope.userAlreadyAdded.push(memberEmail);
                                $scope.updateFreeEmails();
                                $("#userAlreadyAdded").show();
                                $("#selectedMembers").parent().addClass('has-error');
                            }
                            else {
                                $("#userAlreadyAdded").hide();
                                $http({method: 'GET', url: '/api/profile/' + userId})
                                    .success(function (data) {
                                        email = data['attributes'].email;

                                        var firstName = data['attributes'].firstName || "";
                                        var lastName = data['attributes'].lastName || "";
                                        name = (firstName && lastName) ? firstName + " " + lastName : firstName + lastName;
                                        var memberDetails = {
                                            id: userId,
                                            role: role.split("/")[1],
                                            email: email,
                                            name: name
                                        }
                                        $scope.selectedWsMembers.push(memberDetails);
                                        $("#createWs").removeAttr('disabled');
                                        $scope.updateFreeEmails();
                                    });
                            }
                        }
                        else {
                            $scope.userNotMemberList.push(memberEmail);
                            $("#userAlreadyAdded").hide();
                        }
                    });
                });
                $("#selectedMembers").val("");
                $("#userAlreadyAdded").hide();
            }
            else {
                $("#userAlreadyAdded").hide();
                $("#selectedMembers").parent().addClass('has-error');
                $("#emptyEmails").show();
                $scope.updateFreeEmails();
            }
        };

        $scope.changeAccount = function (account) {
            OrgAddon.updateCurrentAccount(account);
        };

        $scope.removeMemberFromWsList = function (user) {
            var removedMember = _.find($scope.selectedWsMembers, function (member) {
                if (member.id == user.id) return member;
            });
            var index = $scope.selectedWsMembers.indexOf(removedMember)
            if (index != -1) {
                $scope.selectedWsMembers.splice(index, 1);
                if (index == 0) {
                    $("#createWs").attr('disabled', 'disabled');
                }
                $scope.updateFreeEmails();
            }
        };

        $scope.workspaceNameValidity = function () {
            $("#userAlreadyAdded").hide();
            $("#emptyEmails").hide();
            $("#wsAlreadyExist").hide();
            $("#selectedMembers").parent().removeClass('has-error');

            var wsName = $("#ws_name").val();
            if (wsName.length > 0) {
                if ((wsName.match(/^[0-9a-zA-Z-._]+$/) != null) && (wsName.length > 3) && (wsName.length < 20) && (wsName[0].match(/^[0-9a-zA-Z]+$/) != null)) {
                    $("#ws_name").parent().removeClass('has-error');
                    $("#emptyWs").hide();
                    $("#wsUserAdd").removeAttr('disabled');
                    return true;
                } else {
                    $("#ws_name").parent().addClass('has-error');
                    $("#emptyWs").show();
                    $("#emptyWs").html("Workspace characters should be between 3 to 20 characters and may have digit, letters and - . _ and may start with digits or letters");
                }
            } else {
                $("#ws_name").parent().addClass('has-error');
                $("#emptyWs").show();
                $("#emptyWs").html("Define the name of the workspace");
            }
            $("#wsUserAdd").attr('disabled', 'disabled');
            return false;
        };

        // Create workspace related to account
        $scope.createWorkspace = function (selectedMembers) {

            if ($scope.workspaceNameValidity()) {
                var con = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };

                var data = {
                    "accountId": $scope.currentAccount.id,
                    "name": $("#ws_name").val() // needs to be array
                };

                var workspaceId, workspaceName, allocatedRam;


                return $q.all([
                    $http.post('/api/workspace', data, con)
                        .success(function (data) {
                            workspaceId = data.id;
                            workspaceName = data.name;
                        }).error(function (err) {
                            $("#wsAlreadyExist").show();
                            $("#wsAlreadyExist").html(err['message']);
                        })

                ]).then(function (results) {
                    var i = 0;
                    return $q.all([
                        $http({method: 'GET', url: "/api/runner/" + workspaceId + "/resources" }).
                            success(function (data) {
                                allocatedRam = data.totalMemory;
                            }),
                        angular.forEach(selectedMembers, function (member) {
                            var role = $("input[name=user_role_" + i + "]:checked").val();
                            var roles = eval("(function(){return " + role + ";})()");

                            var memberData = {
                                "userId": member.id,
                                "roles": roles // needs to be array
                            };

                            $http.post('/api/workspace/' + workspaceId + '/members', memberData, con)
                                .success(function (data) {
                                    $scope.selectedWsMembers = [];
                                    $scope.updateFreeEmails();
                                })
                                .error(function (err, status) {
                                    $("#addMemberErr").show();
                                    $("#addMemberErr").html(err["message"]);
                                });
                            i++;
                        })
                    ]).then(function (result) {
                        var workspaceDetails = {
                            id: workspaceId,
                            name: workspaceName,
                            allocatedRam: allocatedRam,
                            projects: 0,
                            projectsName: [],
                            developers: (selectedMembers.length)
                        };
                        $scope.workspaces.push(workspaceDetails);
                        $('#addNewWorkspace').modal('toggle');
                        $("#ws_name").val("")
                        $scope.selectedMembers = [];
                        $("#userAlreadyAdded").hide();
                        $("#wsAlreadyExist").hide();
                    })

                });
            }
            else {
                $("#ws_name").parent().addClass('has-error');
                $("#emptyWs").show();
                $("#emptyWs").html("Workspace characters should be between 3 to 20 characters and must have digit, letters and - . _ and must start with digits or letters");

            }

        };

        // Add project lists while removing workspace
        $scope.addWsProject = function (workspace) {
            $scope.selectedWsForRemove = workspace;
        };

        // Remove workspace related to account
        $scope.removeWorkspace = function (workspaceId) {

          $('#removeWorkspaceAlert .alert-success').hide();
          $('#removeWorkspaceAlert .alert-danger').hide();
          Workspace.removeWorkspace(workspaceId).then(function (data) {
            $scope.loadWorkspaceInfo();
            $('#removeWorkspaceButton').attr('disabled', 'disabled');
            $('#removeWorkspaceAlert .alert-success').show();
            $('#removeWorkspaceAlert .alert-danger').hide();
            $timeout(function () {
                $('#removeWorkspaceAlert .alert-success').hide();
                $('#removeWorkspaceButton').removeAttr('disabled');
                $('#removeWorkspaceConfirm').modal('hide');
            }, 1500);

          }, function (error) {
              $('#removeWorkspaceError').text(error.message);
              $('#removeWorkspaceAlert .alert-success').hide();
              $('#removeWorkspaceAlert .alert-danger').show();
              $timeout(function () {
                  $('#removeWorkspaceAlert .alert-danger').hide();
              }, 4500);
          });
      };

        // Remove user from selected list
        $scope.removeUserToList = function (user) {
            var removedMember = _.find($scope.selectedMembers, function (member) {
                if (member.id == user.id) return member;
            });
            var index = $scope.selectedMembers.indexOf(removedMember)
            if (index != -1) {
                $scope.selectedMembers.splice(index, 1);
                if (index == 0) {
                    $("#addMembers").attr('disabled', 'disabled');
                }
            }
        };

        //Check Memory allocation and count left memory.
        $scope.getFreeMemoryAfterAllocation = function (id) {
            var allocated_ram = $("#allocate_ram_" + id).val();
            var sumMemory = 0;
            if (allocated_ram.length > 0 && (allocated_ram.match(/^\d{0,5}$/) != null)) {
                $("#allocationError").hide();
                $scope.defineProperValue = true;
                $("#allocate_ram_" + id).parent().removeClass('has-error');
                angular.forEach($scope.infoForRAMAllocation, function (w) {
                    var value = parseInt(w.allocatedRam);
                    sumMemory += value || 0;
                });
                $scope.leftMemory = $scope.allowedRAM - sumMemory;
                $("#allocationError").hide();
                return true;
            } else {
                $scope.defineProperValue = false;
                $("#allocate_ram_" + id).parent().addClass('has-error');
                $("#allocationError").show();
                $("#allocationError").html("Input value is invalid");
            }
            return false;
        };

        $scope.getInfoForRAMAllocation = function() {
            $scope.allowedRAM = 0;
            $scope.infoForRAMAllocation = [];
            $scope.leftMemory = 0;

            angular.forEach($scope.workspaces, function(workspace) {
                $scope.allowedRAM += parseInt(workspace.allocatedRam, 0);
                $scope.infoForRAMAllocation.push({id: workspace.id, name: workspace.name, allocatedRam: workspace.allocatedRam});
            });
        };

        //Redistribute resources:
        $scope.redistributeResources = function () {
            $("#allocationError").hide();
            var data = [];
            angular.forEach($scope.infoForRAMAllocation, function (w) {
                var updateResourcesDescriptor = {
                    workspaceId: w.id,
                    resources: {"RAM": w.allocatedRam}
                };
                data.push(updateResourcesDescriptor);
            });

            var context = { headers: { 'Content-Type': 'application/json'  }  };
            $http.post('/api/account/' + $scope.currentAccount.id + '/resources/', data, context)
                .success(function () {
                    $('#ramAllocation').modal('toggle');
                    angular.forEach($scope.workspaces, function (workspace) {
                        //  Get workspace's projects and developers using workspace id
                        $http({method: 'GET', url: "/api/runner/" + workspace.id + "/resources" })
                            .success(function (data) {
                                workspace.allocatedRam = data.totalMemory;
                            })
                            .error(processError);
                    });
                })
                .error(processError);

            function processError(err) {
                $("#allocationError").show();
                $("#allocationError").html(err.message);
            }
        }
    });
