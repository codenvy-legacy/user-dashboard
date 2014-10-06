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
    .controller('workspaceInfoCtrl', function ($scope, Account, Workspace, WorkspaceInfo, $http, $q, $route, $timeout) {

      $scope.isOrgAddOn = false;
      $scope.accountId = [];
      var serviceIds = ["Saas", "OnPremises"];
      var packages = ["Team", "Enterprise"];

      return $q.all([
        Account.getAccountId().then(function (response){
          $scope.accountId.push(_.pluck(_.pluck(response, 'accountReference'), 'id')[0]);
        })
      ]).then(function () {
        Account.getSubscription($scope.accountId[0]).then(function (response){
          var serviceId = _.pluck(response, 'serviceId')[0];
          var packageName = _.pluck(_.pluck(response, 'properties'),'Package')[0];

          // Check for subscription is available or not for organization tab
          if(_.contains(serviceIds, serviceId) && _.contains(packages, packageName)) {
            $scope.isOrgAddOn = true;
            var workspaceId = $route.current.params.id;
            $scope.workspace = {};
            $scope.account_members = [];
            $scope.ws_members = [];
            $scope.selectedMembers = [];

            // Display workspace details in workspace
            WorkspaceInfo.getDetail(workspaceId).then(function (response){
              var members = [];
              return $q.all([

                $http({method: 'GET', url: $.map(response.links,function(obj){if(obj.rel=="get members") return obj.href})[0]})
                  .success(function (data) {
                    angular.forEach(data, function (member) {
                      var email, name, role;
                      if(member['roles'].length>1)
                          {
                            role = member['roles'][1].split("/")[1];
                          }
                        else{
                          role = member['roles'][0].split("/")[1];
                        }

                      //  Get member's email and name
                      
                      return $q.all([
                        $http({method: 'GET', url: '/api/profile/'+member['userId']})
                          .success(function (data) {
                            email = data['attributes'].email;
                            name = data['attributes'].firstName +" "+ data['attributes'].lastName;
                          })
                      ]).then(function (results) {
                        
                        

                        var memberDetails = {
                          id: member['userId'],
                          role: role,
                          email: email,
                          name: name
                        }

                        members.push(memberDetails);
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

            // Get all members of the current workspace
            Workspace.getMembersForWorkspace(workspaceId).then(function (response){
              $scope.ws_members = response;
            });

            // Get all members of the current organization/account
            $http({method: 'GET', url: '/api/account/'+$scope.accountId[0]+'/members'})
              .success(function(members){
                $scope.account_members = members;
              })
              .error(function(error){
            });

            // Add members to workspace list
            $scope.addMemberToWsList = function(){
              var selectedMembers = $("#selectedMembers").val();
              var selectedMemberEmails = selectedMembers.split(",");
              var role = $("input[name=ws_member_role]:checked").val();

              $("#userNotFoundError").hide();
              $("#userNotMemberList").hide();
              $("#userAlreadyAdded").hide();
              $("#emptyEmails").hide();
              $("#addMemberErr").hide();

              $scope.userNotFoundList = [];
              $scope.userNotMemberList = [];
              $scope.userAlreadyAdded =[];

              if (selectedMembers.length>0){
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
                    var foundMember = _.find($scope.account_members, function(member){ if(member.userId == userId) return member; });
                    var index = $scope.account_members.indexOf(foundMember);
                    if (index != -1) {
                      var alreadyAddedMember = _.find($scope.selectedMembers, function(member){ if(member.id == userId) return member; });
                      var alreadyWsMember = _.find($scope.ws_members, function(member){ if(member.userId == userId) return member; });
                      if((typeof(alreadyAddedMember)!="undefined") || (typeof(alreadyWsMember)!="undefined")){
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
                            name = data['attributes'].firstName +" "+ data['attributes'].lastName;
                            var memberDetails = {
                              id: userId,
                              role: role.split("/")[1],
                              email: email,
                              name: name
                            }
                            $scope.selectedMembers.push(memberDetails);
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

            // Remove member from selected list
            $scope.removeMemberToList = function(user){
              var removedMember = _.find($scope.selectedMembers, function(member){ if(member.id == user.id) return member; });
              var index = $scope.selectedMembers.indexOf(removedMember)
              if (index != -1) {
                $scope.selectedMembers.splice(index, 1);
              }
            };

            // For add members in workspace for organization Tab
            $scope.addMembersToWs = function(members){
              $("#userNotFoundError").hide();
              $("#userNotMemberList").hide();
              $("#userAlreadyAdded").hide();
              $("#emptyEmails").hide();
              $("#selectedMembers").parent().removeClass('has-error');

              return $q.all([
                angular.forEach(members, function (member) {

                  var con = {
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  };

                  var roles = [
                    "workspace/"+member.role
                  ];

                  var data = {
                    "userId": member.id,
                    "roles": roles // needs to be array
                  };

                  $http.post('/api/workspace/' + workspaceId + "/members",
                    data,
                    con)
                    .success(function (data) {
                      var memberDetails = {
                        id: member.id,
                        role: member.role,
                        email: member.email,
                        name: member.name
                      }
                      $scope.workspace.members.push(memberDetails);
                    })
                    .error(function (err, status) {
                      $("#addMemberErr").show();
                      $("#addMemberErr").html(err["message"]);
                    });
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
                    var index = $scope.workspace.members.indexOf(removeMember)
                    if (index != -1) {
                      $scope.workspace.members.splice(index, 1);
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
            };
            
            // Update workspace member's role
            $scope.updateMemberWs = function(member_role){
            $('#updateWsMemberError').show();
            $scope.member_role = member_role;
            var wcon = { headers: { 'Content-Type': 'application/json'  }  };            
            var memberData = {"userId": $scope.editWsMember.id,"roles": ["workspace/"+$scope.editWsMember.role] };
            
            $http.delete('/api/workspace/'+workspaceId+'/members/' + $scope.editWsMember.id )            
              .success(function (data, status) {                    
              $('#updateMemberRoleModal').modal('toggle');          
                 if(status == 204){
                    var removeMember = _.find($scope.workspace.members, function(member){ if(member.id == $scope.editWsMember.id) return member; });
                    var index = $scope.workspace.members.indexOf(removeMember)
                    if (index != -1) {
                      $scope.workspace.members.splice(index, 1);
                      $http.post('/api/workspace/' + workspaceId + "/members", memberData, wcon)
                      .success(function (data) {
                        $scope.editWsMember.role = member_role
                        $scope.workspace.members.push($scope.editWsMember);
                      })
                      .error(function (err, status) { });
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

          }else{
            $scope.isOrgAddOn = false;
            window.location = "/#/dashboard"
          }
        });
      });
    });
