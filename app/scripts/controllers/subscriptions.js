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
        console.log('Query Users');
        Users.query().then(function(data){
            var ref = data[0].accountReference;
            console.log(ref);
            if(ref.id!=undefined)
            {
                $http.get('/api/account/'+ref.id+'/subscriptions').success(function(datab, status){
                    $scope.subscriptions = $scope.subscriptions.concat(datab);
                });
            }

        });
    });
