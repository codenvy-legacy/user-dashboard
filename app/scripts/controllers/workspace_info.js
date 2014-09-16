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
    .controller('workspaceInfoCtrl', function ($scope, Account, WorkspaceInfo, $http, $q, $route, $timeout) {

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

            // Display workspace details in workspace
            WorkspaceInfo.getDetail(workspaceId).then(function (response){
              var members = [];
              return $q.all([

                $http({method: 'GET', url: $.map(response.links,function(obj){if(obj.rel=="get members") return obj.href})[0]})
                  .success(function (data) {
                    angular.forEach(data, function (member) {

                      //  Get member's email and name
                      var email, name;
                      return $q.all([
                        $http({method: 'GET', url: '/api/profile/'+member['userId']})
                          .success(function (data) {
                            email = data['attributes'].email;
                            name = data['attributes'].firstName +" "+ data['attributes'].lastName;
                          })
                      ]).then(function (results) {
                        var memberDetails = {
                          role: member['roles'][0].split("/")[1],
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
