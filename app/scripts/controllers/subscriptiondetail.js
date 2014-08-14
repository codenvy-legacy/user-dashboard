/*jslint
    browser: true,
    devel:true ,
    node:true,
    nomen: true,
    es5:true
*/

/**
 * @auth Gurdev Singh
 * @date 07/23/2014
 * Controller for Subscription Details
 */

/*global angular, Morris*/

'use strict';
angular.module('odeskApp')
    .controller('SubscriptionDetailsCtrl', function ($scope, $timeout, $http, Account,Users,$route) {
    	var subscriptionId = $route.current.params.id;
        $http.get('/api/account/subscriptions/'+subscriptionId).success(function(data, status){
            $scope.subscription = data;
                $http.get(data.links[2].href).success(function(datab, status){
                    $scope.billing = datab;
                });
        });
    });
