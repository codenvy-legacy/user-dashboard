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
    .directive('udImportZip', function() {
        return {
          restrict: 'E',
          require: '^form',
          scope: {
            workspaces: '=',
            workspaceSelected: '=',
            newProjectData: '='
          },
          templateUrl: 'partials/widgets/importZip.html'
        }
    });