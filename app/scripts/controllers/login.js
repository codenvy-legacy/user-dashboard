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
    .controller('LoginCtrl', function ($scope, $rootScope, $timeout, $http, $location, $cookies, $window, Profile) {
      $scope.username = 'test';
      $scope.password = 'test';
        $scope.submit = function () {
            $http({
                url: "/api/auth/login",
                method: "POST",
                data: { "username": $scope.username, "password": $scope.password}
            }).then(function (response) { // success
                Profile.query().then(function (profile, status) {
                    var fullUserName;
                    if (profile.attributes.firstName && profile.attributes.lastName) {
                        fullUserName = profile.attributes.firstName + ' ' + profile.attributes.lastName;
                    } else {
                        fullUserName = profile.attributes.email;
                    }
                    $rootScope.$broadcast('update_fullUserName', fullUserName);// update User name at top
                });
                $cookies.token = response.data.value;
                $cookies.refreshStatus = "DISABLED";
                $location.path("/dashboard");
            }, function (response) { // optional
                console.log("error on login");
                alert('error');
                console.log(response);
            });
        };

    });
