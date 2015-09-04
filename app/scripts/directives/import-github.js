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
    .constant('localGitHubToken', 'gitHubToken')
    .constant('gitHubCallbackPage', 'gitHubCallback.html')
    .service('utils', function() {
        this.camelCase = function(name) {
            return name.replace(/([\:\-\_]+(.))/g, function(_, separator, letter, offset) {
                return offset ? letter.toUpperCase() : letter;
            });
        };

        this.parseQueryString = function(keyValue) {
            var obj = {}, key, value;
            angular.forEach((keyValue || '').split('&'), function(keyValue) {
                if (keyValue) {
                    value = keyValue.split('=');
                    key = decodeURIComponent(value[0]);
                    obj[key] = angular.isDefined(value[1]) ? decodeURIComponent(value[1]) : true;
                }
            });
            return obj;
        };
    }).factory('popup', [
        '$q',
        '$interval',
        '$window',
        '$location',
        'utils',
        function($q, $interval, $window, $location, utils) {
            var popupWindow = null;
            var polling = null;

            var popup = {};

            popup.popupWindow = popupWindow;

            popup.open = function(url, options, config) {
              var optionsString = popup.stringifyOptions(popup.prepareOptions(options || {}));
              popupWindow = window.open(url, '_blank', optionsString);

              if (popupWindow && popupWindow.focus) {
                  popupWindow.focus();
              }

              return popup.pollPopup(config);
            };

            popup.pollPopup = function(config) {
              var deferred = $q.defer();
              polling = $interval(function() {
                try {
                  if (popupWindow.document.title === 'callbackSuccess') {
                    //var queryParams = popupWindow.location.search.substring(1).replace(/\/$/, '');
                    //var hashParams = popupWindow.location.hash.substring(1).replace(/\/$/, '');
                    //var hash = utils.parseQueryString(hashParams);
                    //var qs = utils.parseQueryString(queryParams);

                    //angular.extend(qs, hash);

                    //if (qs.error) {
                    //    deferred.reject({ error: qs.error });
                    //} else {
                    //    deferred.resolve(qs);
                    //}
                    deferred.resolve(true);

                    popupWindow.close();
                    $interval.cancel(polling);
                  }
                } catch (error) {
                }

                if (popupWindow.closed) {
                  $interval.cancel(polling);
                  deferred.reject({ data: 'Authorization Failed' });
                }
              }, 35);
              return deferred.promise;
            };

            popup.prepareOptions = function(options) {
                var width = options.width || 500;
                var height = options.height || 500;
                return angular.extend({
                    width: width,
                    height: height,
                    left: $window.screenX + (($window.outerWidth - width) / 2),
                    top: $window.screenY + (($window.outerHeight - height) / 2.5)
                }, options);
            };

            popup.stringifyOptions = function(options) {
                var parts = [];
                angular.forEach(options, function(value, key) {
                    parts.push(key + '=' + value);
                });
                return parts.join(',');
            };

            return popup;
        }
    ]).service('organizationNameResolver', function() {
        this.resolve = function (organization) {
            if (!organization) {
                return '';
            }
            return organization.name ? organization.name : organization.login;
        }
    }).filter('filterRepositories', function() {
      return function (repositories, organizationFilter, repositoryNameFilter) {
        if (!repositories) {
          return [];
        }
        var filtered = [];
        for (var i = 0; i < repositories.length; i++) {
          var repository = repositories[i];
          if ((!organizationFilter || repository.owner.login == organizationFilter.login)
              && (!repositoryNameFilter || repository.name.toLocaleLowerCase().indexOf(repositoryNameFilter.toLocaleLowerCase()) >= 0)) {
            filtered.push(repository);
          }
        }
        return filtered;
      }
    }).directive('udImportGithub', [
        '$http',
        '$q',
        '$window',
        '$location',
        '$browser',
        '$modal',
        '$filter',
        'GitHub',
        'Project',
        'organizationNameResolver',
        'popup',
        'gitHubTokenStore',
        function($http, $q, $window, $location, $browser, $modal, $filter, GitHub, Project, organizationNameResolver, popup, gitHubTokenStore) {
          return {
            restrict: 'E',
            require: '^form',
            scope: {
              workspaces: '=',
              workspaceSelected: '=',
              currentUserId: '=',
              newProjectData: '=',
              projectGroups: '='
            },
            link: function($scope, element, attrs, ctrl) {
              $scope.authenticateWithGitHub = function() {
                var redirectUrl = $location.protocol() + '://'
                    + $location.host() + ':'
                    + $location.port()
                    + $browser.baseHref()
                    + 'gitHubCallback.html';
                return popup.open('/api/oauth/authenticate'
                        + '?oauth_provider=github'
                        + '&scope=' + ['user','repo','write:public_key'].join(',')
                        + '&userId=' + $scope.currentUserId
                        + '&redirect_after_login='
                        + redirectUrl,
                    {
                      width: 1020,
                      height: 618
                    })
                    .then(function(result) {
                      return $scope.getAndStoreRemoteToken();
                    }, function(rejectionReason) {
                      return $q.reject(rejectionReason);
                    });
              };

              $scope.getAndStoreRemoteToken = function() {
                return $http({ method: 'GET', url: '/api/github/token/' + $scope.currentUserId}).then(function(result) {
                  if (!result.data) {
                    return false;
                  }
                  gitHubTokenStore.setToken(result.data);
                  $http({ method: 'POST', url: '/api/github/ssh/generate'});
                  return true;
                });
              };
              var currentTokenCheck = null;
              $scope.checkTokenValidity = function() {
                if (currentTokenCheck) {
                  return currentTokenCheck;
                }
                currentTokenCheck = GitHub.user().get(function() {
                  currentTokenCheck = null;
                  return $q.defer().resolve(true);
                }, function() {
                  currentTokenCheck = null;
                  return $q.defer().reject(false);
                }).$promise;
                return currentTokenCheck;
              };

              $scope.checkGitHubAuthentication = function() {
                return $scope.checkTokenValidity().then(function() {
                  return $q.defer().resolve('true');
                }, function() {
                  return $scope.confirmGitHubOAuthPopupModalInstance = $modal.open({
                      templateUrl: 'partials/templates/projects/confirmGitHubOAuthPopUp.html',
                      size: 'sm',
                      scope: $scope
                    }).result;
                });
              };
              $scope.loadRepositories = function() {
                $scope.state = 'LOADING';

                $scope.checkGitHubAuthentication().then(function() {
                  var user = GitHub.user().get();

                  $scope.organizations.push(user);
                  GitHub.organizations().query().$promise.then(function(organizations) {
                    $scope.organizations = $scope.organizations.concat(organizations);

                    var organizationNames = _.map($scope.organizations, 'login');

                    GitHub.userRepositories().query().$promise.then(function(repositories) {
                      $scope.gitHubRepositories = $filter('filter')(repositories, function(repository, index) {
                        return organizationNames.indexOf(repository.owner.login) >= 0;
                      });
                    });
                  });

                  $scope.state = 'LOADED';
                }, function() {
                  $scope.state = 'LOAD_ERROR';
                });
              };

              $scope.selectRepository = function(gitHubRepository) {
                $scope.selectedRepository = gitHubRepository;
                $scope.newProjectData.project.name = gitHubRepository.name;
                $scope.newProjectData.project.description = gitHubRepository.description;
                $scope.newProjectData.source.project.location = gitHubRepository.clone_url ;
              };

              $scope.resolveOrganizationName = organizationNameResolver.resolve;

              $scope.resolveOrganizationType = function(organization) {
                return organization.name ? "Your account" : "Your organization's account";
              };

              $scope.organizations = [];
              $scope.gitHubRepositories = [];

              $scope.state = 'IDLE';
              $scope.checkTokenValidity().then(function() {
                $scope.loadRepositories();
              });

              $scope.$watch('newProjectData.source.project.location', function(newValue, oldValue) {
                var matchRepository = $filter('filter')($scope.gitHubRepositories, function(repository, index) {
                  return repository.clone_url == newValue;
                });
                if (matchRepository) {
                  $scope.selectedRepository = matchRepository[0];
                } else {
                  $scope.selectedRepository = undefined;
                }
              });
            },
            templateUrl: 'partials/widgets/importGitHub.html'
          };
        }
      ]);
