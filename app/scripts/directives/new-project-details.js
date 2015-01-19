/*jslint
 browser: true,
 devel:true ,
 node:true,
 nomen: true,
 es5:true
 */

/**
 * @auth Stéphane Daviet
 * @date 12/1/2014
 * Directive for GitHub project import
 */

/*global angular*/

'use strict';

angular.module('odeskApp')
    .directive('udNewProjectDetails', function() {
        return {
            restrict: 'E',
            scope: {
                workspaces: '=',
                newProjectData: '=',
                parentForm: '='
            },
            link: function ($scope, element, attrs) {
                $scope.newProjectData.workspaceSelected = $scope.workspaces[0];
            },
            templateUrl: 'partials/widgets/newProjectDetails.html'
        }
    });