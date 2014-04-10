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
    .controller('AccountConfigCtrl', function ($scope, Profile, Password) {        
        Profile.query(function (resp) {
            $scope.attributes = resp.attributes;
        });
        
        $scope.updateProfile = function () {
            Profile.update({}, $scope.attributes);
        };
            
        $scope.updatePassword = function () {
            if ($scope.password === $scope.password_verify) {
                Password.update({}, $scope.password);
            } else {
                alert("password don't match");
            }
        };
    });
