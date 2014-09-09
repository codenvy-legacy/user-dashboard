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
  .controller('OrganizationsCtrl', function ($scope, Workspace, Account, $http, $q) {

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
        if(_.contains(serviceIds, serviceId) && _.contains(packages, packageName)) {
          $scope.isOrgAddOn = true;
          $scope.workspaces = [];

          Workspace.all(function (resp) {
            $scope.workspaces = _.filter(resp, function (workspace) { return !workspace.workspaceReference.temporary; });
          });
        }else{
          $scope.isOrgAddOn = false;
          window.location = "/#/dashboard"
        }
      });
    });
  });
