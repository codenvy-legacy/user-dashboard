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
  .controller('OrganizationsCtrl', function ($scope, Account,WorkspaceInfo,Workspace, $http, $q, $timeout) {

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
          $scope.workspaces = [];
          $scope.members = [];
          $scope.selectedMembers = [];

          // Display workspace details in workspace
          $http({method: 'GET', url: '/api/workspace/find/account?id='+$scope.accountId[0]})
            .success(function (workspaces) {

              angular.forEach(workspaces, function (workspace) {
                //  Get workspace's projects and developers using workspace id
                WorkspaceInfo.getDetail(workspace.id).then(function (response){
                  var projectsLength;
                  var membersLength;

                  return $q.all([
                    $http({method: 'GET', url: $.map(response.links,function(obj){if(obj.rel=="get projects") return obj.href})[0]})
                      .success(function (data) {
                        projectsLength = data.length;
                      }),

                    $http({method: 'GET', url: $.map(response.links,function(obj){if(obj.rel=="get members") return obj.href})[0]})
                      .success(function (data) {
                        membersLength = data.length;
                      })
                  ]).then(function (results) {
                      var workspaceDetails = {
                        id: workspace.id,
                        name: workspace.name,
                        projects: projectsLength,
                        developers: membersLength
                      }

                      $scope.workspaces.push(workspaceDetails);
                    });
                });

              });
            })
            .error(function (err) {  });

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

          // Create workspace related to account
          $scope.createWorkspace = function(accountId){

            var deferred = $q.defer();
            var con = {
              headers: {
                'Content-Type': 'application/json'
              }
            };

            var data = {
              "accountId": accountId,
              "name": $("#ws_name").val() // needs to be array
            };

            $http.post('/api/workspace',data,con)
              .success(function (data) {
                var workspaceDetails = {
                  id: data.id,
                  name: data.name,
                  projects: 0,
                  developers: 1
                }
                $scope.workspaces.push(workspaceDetails);
                $('#addNewWorkspace').modal('toggle');
                $("#ws_name").val("")
                deferred.resolve(data); //resolve data
              });
          }

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
                  }
                }
                deferred.resolve(data);
              })
              .error(function (err) {
                deferred.reject();
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
                      name = data['attributes'].firstName +" "+ data['attributes'].lastName;
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

          $scope.updateMember = function(memberEmail){
            $scope.memberEmail = memberEmail;
          };

          // For add user in users list in add members popup modal in organization Tab
          $scope.addUserToList = function(){

            var selectedUsers = $("#selected_users").val();
            var selectedUserEmails = selectedUsers.split(",");

            var role = $("input[name=member_role]:checked").val();
            $scope.userNotFoundList = [];
            $scope.userAlreadyAdded = [];

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

              });
            });
            $("#selected_users").val("");
            $("#userNotFoundError").hide();
            $("#userAlreadyAdded").hide();
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
            return $q.all([
              angular.forEach(members, function (member) {
                $http({method: 'POST', url: '/api/account/'+$scope.accountId[0]+'/members', params: {userid: member.id}})
                  .success(function (data) {
                    $scope.members.push(member);
                  });
              })
            ]).then(function (results) {
              $('#addNewMember').modal('toggle');
              $scope.selectedMembers = [];
              $("#userNotFoundError").hide();
              $("#userAlreadyAdded").hide();
            });
          };

          // Remove member related to account
          $scope.removeMember = function(memberId){
            var deferred = $q.defer();
            $http.delete('/api/account/'+$scope.accountId[0]+'/members/' + memberId )
              .success(function (data, status) {
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
                deferred.reject();
              });
          }

        }else{
          $scope.isOrgAddOn = false;
          window.location = "/#/dashboard"
        }
      });
    });
  });
