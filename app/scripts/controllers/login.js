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
 * Controller for login
 */

/*global angular, $*/
'use strict';

angular.module('odeskApp')
    .controller('LoginCtrl', function ($scope, $timeout, $http, $location, $cookies) {
        $scope.username = 'test';
        $scope.password = 'test';
        $scope.submit = function () {
            $http({
                url: "/api/auth/login",
                method: "POST",
                data: { "username": $scope.username, "password": $scope.password}
                
            }).then(function (response) { // success
                //window.location.href = "/#/dashboard";
                $cookies.token = response.data.token;
                $location.path("/dashboard");
            }, function (response) { // optional
                alert('error');
                console.log(response);
            });
        };
     
    });
