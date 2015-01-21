/**
 * Defines a modal dialog for creating a factory
 * @author Florent Benoit
 */

/*global angular*/

'use strict';

angular.module('odeskApp')
    .factory('newFactory', ['$modal', function($modal) {
      return {
        open: function() {
          return $modal.open({
            templateUrl: 'partials/templates/factories/newFactoryModal.html',
            size: 'lg',
            controller: 'FactoriesCtrl as factoriesCtrl'
          });
        }
      }
    }]);