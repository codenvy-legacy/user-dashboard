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
 * Controller for organizations
 */

/*global angular, $*/
'use strict';

angular.module('odeskApp')
    .controller('OrganizationsCtrl', function ($scope, Account, OrgAddon, WorkspaceInfo, Workspace, $http, $q, $timeout) {
        $scope.$on('orgAddonDataUpdated', function () {
            $scope.accountId = OrgAddon.accounts;
            $scope.isOrgAddOn = OrgAddon.isOrgAddOn;
        });

        return OrgAddon.getOrgAccounts().then(function(){
            if(OrgAddon.isOrgAddOn) {
                $scope.workspaces = [];
                $scope.members = [];
                $scope.selectedMembers = [];
                $scope.selectedWsMembers = [];
                $scope.allowedRAM = 0;
                $scope.infoForRAMAllocation = [];
                $scope.leftMemory = 0;
                $scope.accountId = OrgAddon.accounts;
                $scope.isOrgAddOn = OrgAddon.isOrgAddOn;
                $scope.defineProperValue = false;

                // Display workspace details in workspace
                $http({method: 'GET', url: '/api/workspace/find/account?id='+$scope.accountId[0]})
                    .success(function (workspaces) {

                        angular.forEach(workspaces, function (workspace) {
                            //  Get workspace's projects and developers using workspace id
                            WorkspaceInfo.getDetail(workspace.id).then(function (response){

                                var projectsLength = 0;
                                var projectsName;
                                var membersLength = 0;
                                var allocatedRam;
                                var promises = [];

                                var getProjectsURL = _.find(response.links, function(obj){ return obj.rel=="get projects"});
                                if(getProjectsURL!==undefined) {
                                    promises.push(
                                        $http({method: getProjectsURL.method, url: getProjectsURL.href})
                                            .success(function (data) {
                                                projectsName = _.pluck(data,'name');
                                                projectsLength = data.length;
                                            }));
                                }

                                promises.push(
                                    $http({method: 'GET', url:"/api/workspace/"+ workspace.id +"/members" })
                                        .success(function (data) { membersLength = data.length; }));

                                promises.push(
                                    $http({method: 'GET', url:"/api/runner/"+ workspace.id +"/resources" })
                                        .success(function (data) { allocatedRam = data.totalMemory; }));

                                return $q.all(promises).then(function (results) {
                                    var workspaceDetails = {
                                        id: workspace.id,
                                        name: workspace.name,
                                        allocatedRam:allocatedRam,
                                        projects: projectsLength,
                                        projectsName: projectsName,
                                        developers: membersLength
                                    }
                                    $scope.allowedRAM += parseInt(allocatedRam, 0);
                                    $scope.workspaces.push(workspaceDetails);
                                    $scope.infoForRAMAllocation.push({id:  workspace.id, name: workspace.name, allocatedRam: allocatedRam });
                                });
                            });

                        });
                    })
                    .error(function (err) {  });


                //Add members to workspace list
                $scope.addMemberToWsList = function(){
                    var selectedMembers = $("#selectedMembers").val();
                    var selectedMemberEmails = selectedMembers.split(",");
                    var role = $("input[name=ws_member_role]:checked").val();

                    $("#userNotFoundError").hide();
                    $("#userNotMemberList").hide();
                    $("#userAlreadyAdded").hide();
                    $("#emptyEmails").hide();
                    $("#addMemberErr").hide();
                    $("#wsAlreadyExist").hide();

                    $scope.userNotFoundList = [];
                    $scope.userNotMemberList = [];
                    $scope.userAlreadyAdded =[];

                    if (selected
                        .length>0){
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
                                        $("#userNotFoundError").show();
                                        $("#selectedMembers").parent().addClass('has-error');
                                    })

                            ]).then(function (results) {

                                var foundMember = _.find($scope.members, function(member){ if(member.id == userId) return member; });
                                var index = $scope.members.indexOf(foundMember);
                                if (index != -1) {
                                    var alreadyAddedMember = _.find($scope.selectedWsMembers, function(member){ if(member.id == userId) return member; });
                                    if(typeof(alreadyAddedMember)!="undefined"){
                                        $scope.userAlreadyAdded.push(memberEmail);
                                        $("#userAlreadyAdded").show();
                                        $("#selectedMembers").parent().addClass('has-error');
                                    }
                                    else
                                    {
                                        $("#userAlreadyAdded").hide();
                                        $http({method: 'GET', url: '/api/profile/'+userId})
                                            .success(function (data) {
                                                email = data['attributes'].email;

                                                var firstName = data['attributes'].firstName || "";
                                                var lastName = data['attributes'].lastName || "";
                                                name = (firstName && lastName)? firstName +" "+ lastName : firstName + lastName;
                                                var memberDetails = {
                                                    id: userId,
                                                    role: role.split("/")[1],
                                                    email: email,
                                                    name: name
                                                }
                                                $scope.selectedWsMembers.push(memberDetails);
                                            });
                                    }
                                }
                                else{
                                    $scope.userNotMemberList.push(memberEmail);
                                    $("#userNotMemberList").show();
                                    $("#userAlreadyAdded").hide();
                                    $("#selectedMembers").parent().addClass('has-error');
                                }
                            });
                        });
                        $("#selectedMembers").val("");
                        $("#userNotFoundError").hide();
                        $("#userAlreadyAdded").hide();
                    }
                    else
                    {
                        $("#userAlreadyAdded").hide();
                        $("#selectedMembers").parent().addClass('has-error');
                        $("#emptyEmails").show();
                    }
                };

                $scope.removeMemberFromWsList = function(user){
                    var removedMember = _.find($scope.selectedWsMembers, function(member){ if(member.id == user.id) return member; });
                    var index = $scope.selectedWsMembers.indexOf(removedMember)
                    if (index != -1) {
                        $scope.selectedWsMembers.splice(index, 1);
                    }
                };

                $scope.workspaceNameValidity = function(){
                    $("#userNotFoundError").hide();
                    $("#userNotMemberList").hide();
                    $("#userAlreadyAdded").hide();
                    $("#emptyEmails").hide();
                    $("#wsAlreadyExist").hide();
                    $("#selectedMembers").parent().removeClass('has-error');

                    var wsName = $("#ws_name").val();
                    if (wsName.length>0) {
                        if ((wsName.match(/^[0-9a-zA-Z-._]+$/) != null) && (wsName.length>3) && (wsName.length < 20) && (wsName[0].match(/^[0-9a-zA-Z]+$/) != null)) {
                            $("#ws_name").parent().removeClass('has-error');
                            $("#emptyWs").hide();
                            $("#ws_user_add").removeAttr('disabled');
                            return true;
                        }else{
                            $("#ws_name").parent().addClass('has-error');
                            $("#emptyWs").show();
                            $("#emptyWs").html("<strong> Workspace characters should be between 3 to 20 characters and may have digit, letters and - . _ and may start with digits or letters</strong>");
                        }
                    }else{
                        $("#ws_name").parent().addClass('has-error');
                        $("#emptyWs").show();
                        $("#emptyWs").html("<strong>Define the name of the workspace</strong>");
                    }
                    $("#ws_user_add").attr('disabled','disabled')
                    return false;
                }

                // Create workspace related to account
                $scope.createWorkspace = function(accountId, selectedMembers){

                    if($scope.workspaceNameValidity()) {
                        var con = {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        };

                        var data = {
                            "accountId": accountId,
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
                                }
                                $scope.workspaces.push(workspaceDetails);
                                $('#addNewWorkspace').modal('toggle');
                                $("#ws_name").val("")
                                $scope.selectedMembers = [];
                                $("#userNotFoundError").hide();
                                $("#userAlreadyAdded").hide();
                                $("#wsAlreadyExist").hide();
                            })

                        });
                    }
                    else{
                        $("#ws_name").parent().addClass('has-error');
                        $("#emptyWs").show();
                        $("#emptyWs").html("<strong> Workspace characters should be between 3 to 20 characters and must have digit, letters and - . _ and must start with digits or letters</strong>");

                    }

                };

                // Add project lists while removing workspace
                $scope.addWsProject = function(workspace){
                    $scope.selectedWsForRemove = workspace;
                };

                // Remove workspace related to account
                $scope.removeWorkspace = function(workspaceId){
                    var deferred = $q.defer();
                    $http.delete('/api/workspace/' + workspaceId )
                        .success(function (data, status) {
                            if(status == 204){
                                var removeWS = _.find($scope.workspaces, function(ws){ if(ws.id == workspaceId) return ws; });
                                var index = $scope.workspaces.indexOf(removeWS)
                                if (index != -1) {
                                    $scope.workspaces.splice(index, 1);
                                    $('#removeWorkspaceConfirm').modal('toggle');
                                }
                            }
                            deferred.resolve(data);
                        })
                        .error(function (err) {
                            alert(err.message);
                            deferred.reject();
                            $('#removeWorkspaceConfirm').modal('hide');
                        });
                }

                // Display members details in members page for organizations
                $http({method: 'GET', url: '/api/account/'+$scope.accountId[0]+'/members'})
                    .success(function (members) {

                        angular.forEach(members, function (member) {
                            //  Get member's email and name
                            var email;
                            var name;
                            return $q.all([
                                $http({method: 'GET', url: '/api/profile/'+member['userId']})
                                    .success(function (data) {
                                        email = data['attributes'].email;
                                        var firstName = data['attributes'].firstName || "";
                                        var lastName = data['attributes'].lastName || "";
                                        name = (firstName && lastName)? firstName +" "+ lastName : firstName + lastName;
                                    })
                            ]).then(function (results) {
                                var memberDetails = {
                                    id: member['userId'],
                                    role: member['roles'][0].split("/")[1],
                                    email: email,
                                    name: name
                                }
                                $scope.members.push(memberDetails);
                            });

                        });
                    })
                    .error(function (err) {  });

                $scope.updateMember = function(member){
                    $scope.editMember = member;
                    $scope.member_role = $scope.editMember.role;
                    $('#updateOrgMemberError').hide();
                    $('#updateCurrentWsMemberError').hide();
                };

                //Update organization's member's role
                $scope.updateMemberOrg = function(member_role){

                    var mcon = { headers: { 'Content-Type': 'application/json'  }  };
                    var memberData = {"userId": $scope.editMember.id, "roles": ["account/"+member_role] };

                    var email;
                    var userid;
                    $http.get('/api/user').success(function(data){
                        userid = data["id"];
                        email = data["email"]

                    }).error(function(err){
                        console.log("error occurred");
                    });

                    $http.delete('/api/account/'+$scope.accountId[0]+'/members/' + $scope.editMember.id)
                        .success(function (data, status) {
                            if(status == 204){
                                $('#updateRoleModal').modal('toggle');
                                var removeMember = _.find($scope.members, function(member){ if(member.id == $scope.editMember.id) return member; });
                                var index = $scope.members.indexOf(removeMember)
                                if (index != -1 && $scope.editMember.id != userid) {
                                    $scope.members.splice(index, 1);
                                    $http.post('/api/account/'+$scope.accountId[0]+'/members', memberData, mcon)
                                        .success(function (data) {
                                            $scope.editMember.role = member_role;
                                            $scope.members.push($scope.editMember);
                                        });
                                }
                                else
                                {
                                    $('#updateCurrentWsMemberError').show();
                                }
                            }
                        }).error(function (err) {
                            $('#updateOrgMemberError').show();
                        });
                };

                // For add user in users list in add members popup modal in organization Tab
                $scope.addUserToList = function(){

                    var selectedUsers = $("#selected_users").val();
                    var selectedUserEmails = selectedUsers.split(",");
                    var role = $("input[name=member_role]:checked").val();

                    $("#emptyEmails").hide();

                    $scope.userNotFoundList = [];
                    $scope.userAlreadyAdded = [];
                    if (selectedUsers.length>0){
                        $("#selected_users").parent().removeClass('has-error');
                        $("#emptyEmails").hide();
                        angular.forEach(selectedUserEmails, function (memberEmail) {
                            var email, name, userId;
                            return $q.all([
                                $http({method: 'GET', url: '/api/user/find', params: {email: memberEmail}})
                                    .success(function (data) {
                                        userId = data["id"]
                                    })
                                    .error(function (err) {
                                        $scope.userNotFoundList.push(memberEmail);
                                        $("#userNotFoundError").show();
                                    })

                            ]).then(function (results) {
                                var alreadyListedMember = _.find($scope.members, function(member){ if(member.email == memberEmail) return member; });
                                var alreadyAddedMember = _.find($scope.selectedMembers, function(member){ if(member.id == userId) return member; });

                                if((typeof(alreadyAddedMember)!="undefined") || (typeof(alreadyListedMember)!="undefined")){
                                    $scope.userAlreadyAdded.push(memberEmail);
                                    $("#userAlreadyAdded").show();
                                }else{
                                    $http({method: 'GET', url: '/api/profile/'+userId})
                                        .success(function (data) {
                                            email = data['attributes'].email;
                                            var firstName = data['attributes'].firstName || "";
                                            var lastName = data['attributes'].lastName || "";
                                            name = (firstName && lastName)? firstName +" "+ lastName : firstName + lastName;
                                            var memberDetails = {
                                                id: userId,
                                                role: role.split("/")[1],
                                                email: email,
                                                name: name
                                            }
                                            $scope.selectedMembers.push(memberDetails);
                                        });
                                }

                            });
                        });
                        $("#selected_users").val("");
                        $("#userNotFoundError").hide();
                        $("#userAlreadyAdded").hide();
                    }
                    else
                    {
                        $("#userAlreadyAdded").hide();
                        $("#selected_users").parent().addClass('has-error');
                        $("#emptyEmails").show();
                    }
                };

                // Remove user from selected list
                $scope.removeUserToList = function(user){
                    var removedMember = _.find($scope.selectedMembers, function(member){ if(member.id == user.id) return member; });
                    var index = $scope.selectedMembers.indexOf(removedMember)
                    if (index != -1) {
                        $scope.selectedMembers.splice(index, 1);
                    }
                };

                // For add members in organization Tab
                $scope.addMembers = function(members){
                    var i = 0;
                    return $q.all([

                        angular.forEach(members, function (member) {
                            var con = {
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            };

                            var role = $("input[name=user_role_"+i+"]:checked").val();
                            var data = {
                                "userId": member.id,
                                "roles": [
                                        "account/"+role.split("/")[1]
                                ]
                            };
                            member.role = role.split("/")[1];

                            $http.post('/api/account/'+$scope.accountId[0]+'/members', data, con)
                                .success(function (data) {
                                    $scope.members.push(member);
                                });
                            i++;
                        })
                    ]).then(function (results) {
                        $('#addNewMember').modal('toggle');
                        $scope.selectedMembers = [];
                        $("#userNotFoundError").hide();
                        $("#userAlreadyAdded").hide();
                    });
                };

                $scope.addMemberProject = function(member){
                    $scope.selectedMemberForRemove = member;
                };
                // Remove member related to account
                $scope.removeMember = function(memberId){
                    var deferred = $q.defer();
                    $http.delete('/api/account/'+$scope.accountId[0]+'/members/' + memberId )
                        .success(function (data, status) {
                            $('#removeMemberConfirm').modal('toggle');
                            if(status == 204){
                                var removeMember = _.find($scope.members, function(member){ if(member.id == memberId) return member; });
                                var index = $scope.members.indexOf(removeMember)
                                if (index != -1) {
                                    $scope.members.splice(index, 1);
                                }
                            }
                            deferred.resolve(data);
                        })
                        .error(function (err) {
                            alert("It is impossible to remove this user from the organization or update his role. The organization needs at least one account/owner.");
                            deferred.reject();
                        });
                }


               
                //Check Memory allocation and count left memory.
                $scope.getFreeMemoryAfterAllocation = function(id) {
                    var allocated_ram = $("#allocate_ram_"+id).val();
                    var sumMemory = 0;
                    
                    if (allocated_ram.length>0 && (allocated_ram.match(/^\d{0,5}$/) != null)) {
                            $("#allocationError").hide();
                            $scope.defineProperValue = true;
                            $("#allocate_ram_"+id).parent().removeClass('has-error');
                            angular.forEach($scope.infoForRAMAllocation, function(w){
                              var value = parseInt(w.allocatedRam);
                              sumMemory += value || 0;
                            });
                            $scope.leftMemory = $scope.allowedRAM - sumMemory;
                            $("#allocationError").hide();
                            return true;
                    }else{
                            $scope.defineProperValue = false;
                            $("#allocate_ram_"+id).parent().addClass('has-error');
                            $("#allocationError").show();
                            $("#allocationError").html("<strong> Input value is invalid </strong>");
                       }
                    return false;
                };

                //Redistribute resources:
                $scope.redistributeResources = function() {
                    $("#allocationError").hide();
                    var data = [];
                    angular.forEach($scope.infoForRAMAllocation, function(w){
                        var updateResourcesDescriptor = {
                            workspaceId: w.id,
                            resources: {"RAM" : w.allocatedRam}
                        };
                        data.push(updateResourcesDescriptor);
                    });

                    var context = { headers: { 'Content-Type': 'application/json'  }  };
                    $http.post('/api/account/' + $scope.accountId[0] + '/resources/', data, context)
                        .success(function () {
                            $('#ramAllocation').modal('toggle');
                            $scope.leftMemory = 0;
                            $scope.allowedRAM = 0;
                            $scope.infoForRAMAllocation = [];
                            angular.forEach($scope.workspaces, function (workspace) {
                                //  Get workspace's projects and developers using workspace id
                                $http({method: 'GET', url: "/api/runner/" + workspace.id + "/resources" })
                                    .success(function (data) {
                                        workspace.allocatedRam = data.totalMemory;
                                        $scope.allowedRAM += parseInt(workspace.allocatedRam, 0);
                                        $scope.infoForRAMAllocation.push({id:  workspace.id, name: workspace.name, allocatedRam: workspace.allocatedRam});
                                    })
                                    .error(processError);
                            });
                        })
                        .error(processError);

                    function processError(err) {
                        $("#allocationError").show();
                        $("#allocationError").html("<strong>"+err.message+ "</strong>");
                    }

                }

                // For search
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

            }else{
                window.location = "/#/dashboard";
            }
        });


  });
