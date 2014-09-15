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
    .controller('workspaceInfoCtrl', function ($scope, Account, WorkspaceInfo, $http, $q, $route) {

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
              var members;
              return $q.all([

                $http({method: 'GET', url: $.map(response.links,function(obj){if(obj.rel=="get members") return obj.href})[0]})
                  .success(function (data) {
                    members = data;
                  })
              ]).then(function (results) {
                $scope.workspace = {
                  id: workspaceId,
                  name: response.name,
                  members: members
                }

              });
            });

          }else{
            $scope.isOrgAddOn = false;
            window.location = "/#/dashboard"
          }
        });
      });
    });
