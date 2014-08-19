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
 * Controller for login (used only for dev mode)
 */

/*global angular, $*/
'use strict';

angular.module('odeskApp')
    .controller('LoginCtrl', function ($scope, $timeout, $http, $location, $cookies, $window) {
      $scope.username = 'test';
      $scope.password = 'test';
        $scope.submit = function () {
            $http({
                url: "/api/auth/login",
                method: "POST",
                data: { "username": $scope.username, "password": $scope.password}
            }).then(function (response) { // success
                $cookies.token = response.data.value;
                $cookies.refreshStatus = "DISABLED"
                $location.path("/dashboard");
            }, function (response) { // optional
                console.log("error on login");
                alert('error');
                console.log(response);
            });
        };

    });
