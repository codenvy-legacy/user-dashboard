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
    .factory('newProject', ['$modal', function($modal) {
      return {
        open: function(currentUserId, workspaces, type) {
          return $modal.open({
            templateUrl: 'partials/templates/projects/newProjectModal.html',
            size: 'lg',
            resolve: {
              currentUserId: function() {
                return currentUserId;
              },
              workspaces: function() {
                return workspaces;
              },
              type: function() {
                return type;
              }
            },
            controller: 'NewProjectCtrl as newProjectCtrl'
          });
        }
      }
    }]);