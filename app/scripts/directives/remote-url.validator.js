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
 * Directive to validate Git/Zip URLs
 */

/*global angular*/

'use strict';

var DIRECTIVE_NAME = 'udRemoteUrl';

angular.module('odeskApp')
  .constant('GIT_URL_REGEXP', /^(git|ssh|http(s)?)|(git@[\w\.]+):(\/\/)?[\w\.@\:\/\-~]+\.git\/?$/)
  .constant('REGULAR_URL_REGEXP', /^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/)
  .directive(DIRECTIVE_NAME, ['GIT_URL_REGEXP', 'REGULAR_URL_REGEXP', function(GIT_URL_REGEXP, REGULAR_URL_REGEXP) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function($scope, element, attrs, modelCtrl) {
        var validate = function(viewValue) {
          var importProjectType = attrs[DIRECTIVE_NAME];
          
          var validity = false;
          switch (importProjectType) {
            case 'git':
              validity = GIT_URL_REGEXP.test(viewValue);
              break;
            case 'zip':
              validity = REGULAR_URL_REGEXP.test(viewValue);
              break;
            default:
              validity = false;
              break;
          }
          
          modelCtrl.$setValidity(DIRECTIVE_NAME, validity);
          return viewValue;
        };
        
        modelCtrl.$parsers.unshift(validate);
        modelCtrl.$formatters.unshift(validate);
        
        attrs.$observe(DIRECTIVE_NAME, function(importProjectType) {
          validate(modelCtrl.$viewValue);
        });
      }
    }
  }]);