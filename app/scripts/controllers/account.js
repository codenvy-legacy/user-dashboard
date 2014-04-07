/*jslint
    browser: true,
    devel:true ,
    node:true,
    nomen: true,
    es5:true
*/

/**
 * @auth Gaurav Meena
 * @date 01/16/2014
 * This script will contain all controller related to account section
 */

/*global angular, $*/

'use strict';
angular.module('odeskApp')
    .controller('AccountConfigCtrl', function ($scope, $http, userProfile, password) {
        $scope.attributes = [
            {"name" : "firstName", "value" : "testfirst", "description" : null},
            {"name" : "lastName", "value" : "testlast", "description" : null},
            {"name" : "phone", "value" : "------", "description" : null},
            {"name" : "employer", "value" : "------", "description" : null},
            {"name" : "jobtitle", "value" : "------", "description" : null},
            {"name" : "email", "value" : "--@----.---", "description": "User email"}
        ];
        
        userProfile.query(function (resp) {
            $scope.attributes = resp.attributes;
        });
        
        $scope.updateProfile = function () {
            userProfile.update({}, $scope.attributes);
        };
            
        $scope.updatePassword = function () {
            if ($scope.password === $scope.password_verify) {
                password.update({}, $scope.password);
            } else {
                alert("password don't match");
            }
        };
    });
