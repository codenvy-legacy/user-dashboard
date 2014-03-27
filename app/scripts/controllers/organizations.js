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
    .controller('OrganizationsCtrl', function ($scope, $timeout, projectList) {
        $scope.organizations = 1;
    });
