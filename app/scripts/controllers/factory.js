/**
 * @author Florent Benoit
 * Controller for a given factory
 */

/*global angular, Morris*/

'use strict';
angular.module('odeskApp')
	.controller('FactoryCtrl', function ($scope, $http, $route, $filter, $window, $modal) {

		$scope.resetMessages = function() {
			$scope.factoryConfigurationError = null;
			$scope.factoryConfigurationOK = null;
		}

		$scope.resetMessages();

		$scope.factoryId = $route.current.params.id;

		$scope.loadDetails = function (factoryId, displayOK) {
			$scope.resetMessages();
			var _uri = '/api/factory/' + factoryId;
			$http.get(_uri).success(function (data, status) {
				$scope.factoryVersion = data.v;

				$scope.factoryURL = data.links[5].href;

				$scope.factoryDate = data.creator.created;
				$scope.factoryTracked = data.creator.accountId != null;

				// remove links for display (links are automatically generated so no need to display them)
				delete data.links;
				$scope.factoryContent = $filter('json')(data, 2);

				if (displayOK) {
					$scope.factoryConfigurationOK = "Factory successfully reloaded!";
				}

			}).error(function (data,status) {
				// redirect to factories in case of errors
				$window.location.href= "#/factories";
			});

		}


		$scope.loadDetails($scope.factoryId);


		$scope.removeConfirmFactory = function() {
			$('#delete-factory-alert .alert-success').hide();
			$('#delete-factory-alert .alert-danger').hide();

			$modal.open({
				templateUrl: 'partials/templates/factories/deleteFactoryModal.html',
				scope: $scope,
				size: 'lg',
				controller: 'FactoriesCtrl as factoriesCtrl'
			});

		}

		$scope.removeFactory = function($item) {

			var _uri = '/api/factory/' + $scope.factoryId;
				$http.delete(_uri).success(function (data, status) {
					$item.$close();
					// redirect to factories as it has been removed
					$window.location.href= "#/factories";
					$route.reload();
				}).error(function(data, status, headers, config) {
					console.log("Unable to remove factory" + data);
				});;
		}


		$scope.updateDetails = function (factoryId) {
			$scope.resetMessages();
			var _uri = '/api/factory/' + factoryId;
			$http.put(_uri, $scope.factoryContent).success(function (data, status) {
				$scope.factoryConfigurationOK = "Factory successfully updated!";
			}).error(function(data, status, headers, config) {
				$scope.factoryConfigurationError = "Unable to update factory: " + $filter('json')(data, 3);
			});;
		}

	});