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
 * Controller for organization details
 */

/*global angular, $*/
'use strict';

angular.module('odeskApp')
    .controller('OrgdetailCtrl', function ($scope, $timeout, $http, $location, $route) {
        $scope.name = $route.current.params.name;
    });
