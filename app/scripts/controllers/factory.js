/**
 * @author Florent Benoit
 * Controller for a given factory
 */

/*global angular, Morris*/

'use strict';
angular.module('odeskApp')
	.controller('FactoryCtrl', function ($scope, $http, $route, newFactory, $filter, $window, $modal, Users) {

		$scope.resetMessages = function() {
			$scope.factoryConfigurationError = null;
			$scope.factoryConfigurationOK = null;
		}

		$scope.resetMessages();

		$scope.factoryId = $route.current.params.id;

    $scope.userId = '';
		$scope.accountId = '';
		$scope.email = '';

			$scope.loadAccount = function () {
				Users.query().then(function(data){
					for (var j = data.length - 1; j >= 0; j--) {
						var ref = data[j].accountReference;
						if(ref.id!=undefined)
						{
							//Get the account's susbcription only if user = accountOwner
							var isAccountOwner= false;

							for (var iAccount = data[j].roles.length - 1; iAccount >= 0; iAccount--) {
								if (data[j].roles[iAccount] == "account/owner") {
									  $scope.userId = data[j].userId;
							    	$scope.accountId = ref.id;
							}

							};

						}
					};
				});

		  }


	 $scope.loadAccount();


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

		/**
		* Open the new factory modal dialog
		*/
		$scope.createNewFactory = function () {
			newFactory.open();
		};

		$scope.loadDetails($scope.factoryId);


		$scope.loadFactorySnippets = function(factoryId) {
			var _uri = '/api/factory/' + factoryId;
			$http.get(_uri).success(function (data, status) {

				for (var l = 0; l < data.links.length; l++) {
					var link = data.links[l];
					if ("create-project" == link.rel) {
						$scope.factoryURL = link.href;
					} else if ("snippet/markdown" == link.rel) {
						$http.get(link.href).success(function (data, status) {
							$scope.factorySnippetMarkdown = data;
						}).error(function (data, status) {
							// display a fallback for the link
							if (409 == status) {
								$scope.factorySnippetMarkdown = "[Factory link](" + $scope.factoryURL + ")";
							} else {
								$scope.factorySnippetMarkdown = "Error: " + $filter('json')(data, 2);
							}
						});
					} else if ("snippet/html" == link.rel) {
						$http.get(link.href).success(function (data, status) {
							$scope.factorySnippetHTML = data;
						}).error(function (data, status) {
							$scope.factorySnippetHTML = "Error: " + $filter('json')(data, 2);
						});
					}
				}
			});
		}


		$scope.openSnippets = function(factoryId) {
			// load snippets details
			$scope.loadFactorySnippets(factoryId);

			// open modal
			$modal.open({
				templateUrl: 'partials/templates/factories/shareFactoryModal.html',
				scope: $scope
			});
		}


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
