/*jslint
    browser: true,
    devel:true ,
    node:true,
    nomen: true,
    es5:true
*/

/**
 * @auth Gurdev Singh
 * @date 07/18/2014
 * Controller for Subscriptions
 */

/*global angular, Morris*/

'use strict';
angular.module('odeskApp')
    .controller('SubscriptionsCtrl', function ($scope, $timeout, $http, Account,Users) {
        $scope.subscriptions = [];

        var accountId;
        Users.query().then(function(data){
            Account.query(data[0].id).then(function(datab){
                accountId = datab[0].accountId;
                console.log(accountId);
                $http.get('/api/account/'+accountId+'/subscriptions').success(function(data, status){
                    $scope.subscriptions = $scope.subscriptions.concat(data);
                });
            });
        });

        $scope.deleteSubscription = function () {
            $http({method: 'DELETE', url: $scope.selected.url}).
              success(function (status) {
                $scope.subscriptions = _.without($scope.subscriptions, _.findWhere($scope.subscriptions,  $scope.selected));                
              });
        };
    });
