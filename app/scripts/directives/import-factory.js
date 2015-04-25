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
    .directive('udImportFactory', [
      '$http',
      '$q',
      '$window',
      '$filter',
      '$timeout',
      '$log',
      'FileUploader',
      function($http, $q, $window, $filter, $timeout, $log, FileUploader) {
        return {
          restrict: 'E',
          require: '^form',
          scope: {
            workspaces: '=',
            workspaceSelected: '=',
            newProjectData: '=',
            importType: '=',
            projectGroups: '='
          },
          link: {
            pre: function($scope, element, attrs, formCtrl) {
              FileUploader.FileSelect.prototype.isEmptyAfterSelection = function() {
                return true;
              };
              $scope.uploader = new FileUploader({
              });

              $scope.initCodeMirrorInstance = function(editorInstance) {
                $scope.codeMirroInstance = editorInstance;

                editorInstance.on('drop', function(editorInstance, event) {
                  editorInstance.doc.setValue('');
                });
                editorInstance.on("update", function(editorInstance) {
                  formCtrl.$setValidity('jsonConfig', !$scope.codeMirroInstance.state.lint.marked.length > 0);
                  $scope.$apply('jsonConfig');
                });
              };
            },
            post: function($scope, element, attrs, formCtrl) {
              $scope.setJsonContent = function(configObject) {
                $scope.jsonConfig = $filter('json')(configObject, 2);
              };

              $scope.update = function() {
                try {
                  $scope.newProjectData = angular.fromJson($scope.jsonConfig);
                } catch (e) {
                  // Do nothing
                }
              };

              $scope.$watch('newProjectData', function(newValue, oldValue) {
                $scope.setJsonContent(newValue);
                formCtrl.$setValidity('jsonConfig', true);
              }, true);

              $scope.$watch('importType', function(newValue, oldValue) {
                if (newValue == 'Factory') {
                  // Dirty hack to refresh Codemirror and be sure it is displayed
                  $timeout(function () {
                    $scope.codeMirroInstance.refresh();
                    $scope.codeMirroInstance.focus();
                  }, 500);
                }
              });

              $scope.uploader.onAfterAddingFile = function(fileItem) {
                $scope.uploadedFileName = fileItem._file.name;
                var reader = new FileReader();
                reader.readAsText(fileItem._file);
                reader.onload = function () {
                  $scope.newProjecData = {};
                  try {
                    $scope.newProjectData = angular.fromJson(reader.result);
                  } catch (e) {
                    // Invalid JSON, leave it unformatted
                    $scope.jsonConfig = reader.result;
                  }
                  $scope.$apply();
                };
                reader.onerror = function () {
                  $log.error('Error reading file');
                }
              }
            }
          },
          templateUrl: 'partials/widgets/importFactory.html'
        }
      }]);