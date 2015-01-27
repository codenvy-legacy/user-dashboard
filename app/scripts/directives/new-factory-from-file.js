/**
 * Defines the way to select a factory file
 * @author Florent Benoit
 */

'use strict';

angular.module('odeskApp')
    .directive('udNewFactoryFromFile', [
        '$http',
        '$q',
        '$window',
        'FileUploader',
        function($http, $q, $window, FileUploader) {
            return {
                restrict: 'E',
                link: {

                    pre: function($scope) {
                        FileUploader.FileSelect.prototype.isEmptyAfterSelection = function() {
                            return true;
                        };
                        var uploader = $scope.uploader = new FileUploader();
                    },
                    post: function($scope) {
                        var uploadElement = angular.element('#uploadFileForCreatingFactory');
                        $scope.clickUpload = function() {
                            uploadElement.trigger('click');
                        }

                        $scope.uploader.onAfterAddingFile = function(fileItem) {
                            $scope.uploadedFileName = fileItem._file.name;
                                var reader = new FileReader();
                                reader.readAsText(fileItem._file);
                                reader.onload = function () {
                                    try {
                                        $scope.factoryContent = $filter('json')(angular.fromJson(reader.result), 2);
                                    } catch (e) {
                                        // Invalid JSON, leave it unformatted
                                        $scope.factoryContent = reader.result;
                                    }
                                    $scope.factoryConfigurationOK = "Successfully loaded file's configuration " + $scope.uploadedFileName;
                                    $scope.$apply();
                                };
                                reader.onerror = function () {
                                    console.log('Error reading file');
                                }
                        }
                    }
                },
                templateUrl: 'partials/widgets/newFactoryFromFile.html'
            }
        }]);