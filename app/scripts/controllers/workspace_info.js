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
    .controller('workspaceInfoCtrl', function ($scope, Account, OrgAddon, Workspace, WorkspaceInfo, $http, $q, $route, $timeout) {

        $scope.$on('orgAddonDataUpdated', function () {
            $scope.accountId = OrgAddon.accounts;
            $scope.isOrgAddOn = OrgAddon.isOrgAddOn;
        });

        $scope.init = function() {
            // Check for subscription is available or not for organization tab
            if(OrgAddon.isOrgAddOn) {
                $scope.isOrgAddOn = OrgAddon.isOrgAddOn;
                var workspaceId = $route.current.params.id;
                $scope.workspace = {};
                $scope.account_members = [];
                $scope.usedEmails = [];
                $scope.selectedMembers = [];
                $scope.accountId = OrgAddon.accounts;

                // Display workspace details in workspace
                WorkspaceInfo.getDetail(workspaceId).then(function (response){
                    var members = [];
                    return $q.all([
                        // Get all members of the current workspace
                        $http({method: 'GET', url:"/api/workspace/"+ workspaceId +"/members" })
                            .success(function (data) {
                                angular.forEach(data, function (member) {
                                    var email, name;
                                    var role = $scope.userRolesToStr(member['roles']);
                                    //  Get member's email and name

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
                                            role: role,
                                            email: email,
                                            name: name
                                        }

                                        members.push(memberDetails);
                                        updateUsedEmails();
                                    });

                                });
                            })

                    ]).then(function (results) {
                        $scope.workspace = {
                            id: workspaceId,
                            name: response.name,
                            members: members
                        }
                    });
                });

                var updateUsedEmails = function(){
                    $scope.usedEmails = [];

                    angular.forEach($scope.workspace.members, function (member) {
                        $scope.usedEmails.push(member.email);
                    });
                    angular.forEach($scope.selectedMembers, function (member) {
                        $scope.usedEmails.push(member.email);
                    });
                    $scope.usedEmails = $scope.usedEmails.concat($scope.userAlreadyAdded);
                    //update selected fields
                    $("#selectedMembers").select2({
                        formatNoMatches: function() {
                            return 'No member to add';
                        },
                        placeholder: "User(s) email"
                    });
                }

                // Get all members of the current organization/account
                $http({method: 'GET', url: '/api/account/'+$scope.accountId[0]+'/members'})
                    .success(function(members){
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
                                $scope.account_members.push(memberDetails);
                                updateUsedEmails();
                            });

                        });
                    })
                    .error(function(error){
                    });

                $scope.userRolesToStr = function(roles){
                    var str = "";
                    angular.forEach(roles, function(r) {
                        str += r.split("/")[1];
                        str += roles.indexOf(r) < (roles.length - 1) ? ", " : "";
                    });
                    return str;
                }

                // Add members to workspace list
                $scope.addMemberToWsList = function(){
                    var selectedMemberEmails = $("#selectedMembers").val();
                    var role = $("input[name=ws_member_role]:checked").val();

                    $("#userNotFoundError").hide();
                    $("#userNotMemberList").hide();
                    $("#userAlreadyAdded").hide();
                    $("#emptyEmails").hide();
                    $("#addMemberErr").hide();

                    $scope.userNotFoundList = [];
                    $scope.userNotMemberList = [];
                    $scope.userAlreadyAdded =[];

                    if (selectedMemberEmails != null){
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
                                var foundMember = _.find($scope.account_members, function(member){ if(member.id == userId) return member; });
                                var index = $scope.account_members.indexOf(foundMember);
                                if (index != -1) {
                                    var alreadyAddedMember = _.find($scope.selectedMembers, function(member){ if(member.id == userId) return member; });
                                    var alreadyWsMember = _.find($scope.workspace.members, function(member){ if(member.id == userId) return member; });
                                    if((typeof(alreadyAddedMember)!="undefined") || (typeof(alreadyWsMember)!="undefined")){
                                        $scope.userAlreadyAdded.push(memberEmail);
                                        updateUsedEmails();
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
                                                $scope.selectedMembers.push(memberDetails);
                                                $("#addMembers").removeAttr('disabled');
                                                updateUsedEmails();
                                            });
                                    }
                                }
                                else{
                                    $scope.userNotMemberList.push(memberEmail);
                                    $("#userAlreadyAdded").hide();
                                }
                            });
                        });
                        $("#selectedMembers").val("");
                        $("#userAlreadyAdded").hide();
                    }
                    else
                    {
                        $("#userAlreadyAdded").hide();
                        $("#selectedMembers").parent().addClass('has-error');
                        $("#emptyEmails").show();
                        updateUsedEmails();
                    }
                };

                // Remove member from selected list
                $scope.removeMemberToList = function(user){
                    var removedMember = _.find($scope.selectedMembers, function(member){ if(member.id == user.id) return member; });
                    var index = $scope.selectedMembers.indexOf(removedMember)
                    if (index != -1) {
                        $scope.selectedMembers.splice(index, 1);
                    }
                    if (index == 0){
                        $("#addMembers").attr('disabled','disabled');
                    }
                    updateUsedEmails();
                };

                // For add members in workspace for organization Tab
                $scope.addMembersToWs = function(members){
                    $("#userNotFoundError").hide();
                    $("#userNotMemberList").hide();
                    $("#userAlreadyAdded").hide();
                    $("#emptyEmails").hide();
                    $("#selectedMembers").parent().removeClass('has-error');

                    var i = 0;

                    return $q.all([
                        angular.forEach(members, function (member) {

                            var con = {
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            };

                            var role = $("input[name=user_role_"+i+"]:checked").val();
                            var rolesArray = eval("(function(){return " + role + ";})()");
                            var data = {
                                "userId": member.id,
                                "roles": rolesArray
                            };

                            $http.post('/api/workspace/' + workspaceId + "/members",
                                data,
                                con)
                                .success(function (data) {
                                    var memberDetails = {
                                        id: data.userId,
                                        role: $scope.userRolesToStr(rolesArray),
                                        email: member.email,
                                        name: member.name
                                    };
                                    $scope.workspace.members.push(memberDetails);

                                }).error(function (err, status) {
                                    $("#addMemberErr").show();
                                    $("#addMemberErr").html(err["message"]);
                                });

                            i++;
                        })
                    ]).then(function (results) {
                        $('#addWorkspaceNewMember').modal('toggle');
                        $scope.selectedMembers = [];
                        $("#userNotFoundError").hide();
                        $("#userAlreadyAdded").hide();
                    });
                };

                $scope.addMemberProject = function(member){
                    $scope.selectedMemberForRemove = member;
                };
                // Remove member related to workspace
                $scope.removeMemberFromWs = function(memberId){
                    var deferred = $q.defer();
                    $http.delete('/api/workspace/'+workspaceId+'/members/' + memberId )
                        .success(function (data, status) {

                            $('#removeMemberConfirm').modal('toggle');
                            if(status == 204){
                                var removeMember = _.find($scope.workspace.members, function(member){ if(member.id == memberId) return member; });
                                var index = $scope.workspace.members.indexOf(removeMember);
                                if (index != -1) {
                                    $scope.workspace.members.splice(index, 1);
                                    updateUsedEmails();
                                }
                            }
                            deferred.resolve(data);
                        })
                        .error(function (err) {
                            alert("It is impossible to remove this user from the organization or update his role. The organization needs at least one workspace/admin.");
                            deferred.reject();
                        });
                }

                $scope.updateWsMember = function(member){
                    $scope.editWsMember = member;
                    $scope.member_role = $scope.editWsMember.role;
                    $('#updateWsMemberError').hide();
                    $('#updateCurrentWsMemberError').hide();
                };

                // Update workspace member's role
                $scope.updateMemberWs = function(member_role){
                    var wcon = { headers: { 'Content-Type': 'application/json'  }  };
                    var memberData = {"userId": $scope.editWsMember.id,"roles": ["workspace/"+$scope.member_role] };
                    var email;
                    var userid;
                    $http.get('/api/user').success(function(data){
                        userid = data["id"];
                        email = data["email"]

                    }).error(function(err){
                        console.log("error occurred");
                    });

                    $http.delete('/api/workspace/'+workspaceId+'/members/' + $scope.editWsMember.id )
                        .success(function (data, status) {
                            $('#updateMemberRoleModal').modal('toggle');
                            if(status == 204){
                                var removeMember = _.find($scope.workspace.members, function(member){ if(member.id == $scope.editWsMember.id) return member; });
                                var index = $scope.workspace.members.indexOf(removeMember)
                                if (index != -1 && $scope.editWsMember.id != userid) {
                                    $scope.workspace.members.splice(index, 1);

                                    $http.post('/api/workspace/' + workspaceId + "/members", memberData, wcon)
                                        .success(function (data) {
                                            $scope.editWsMember.role = member_role
                                            $scope.workspace.members.push($scope.editWsMember);
                                            updateUsedEmails();
                                        })
                                        .error(function (err, status) { });
                                }
                                else
                                {
                                    $('#updateCurrentWsMemberError').show();
                                }
                            }
                            else if(status == 409){
                                $('#updateWsMemberError').show();
                            }
                        }).error(function (err) {
                            $('#updateWsMemberError').show();
                        });

                };

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

            } else{
                window.location = "/#/dashboard"
            }
        }


        if (OrgAddon.accounts.length > 0){
            $scope.init();
        } else {
            return OrgAddon.getOrgAccounts().then(function() {
                $scope.init();
            });
        }

    });
