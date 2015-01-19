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
    .factory('gitHubTokenStore', function() {
        return {
            setToken: function(token) {
                localStorage.setItem('gitHubToken', token);
            },
            getToken: function() {
                return localStorage.getItem('gitHubToken');
            }
        }
    }).factory('GitHubTokenInjectorInterceptor', ['$q', 'gitHubTokenStore', function($q, gitHubTokenStore) {
        return {
            request: function(config) {
                if (config.url.indexOf('https://api.github.com') == 0) {
                    var token = gitHubTokenStore.getToken();
                    if (token) {
                        config.headers['Authorization'] = 'token ' + token;
                    }
                }
                return config;
            }
        };
    }]).config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('GitHubTokenInjectorInterceptor');
    }]).service('utils', function() {
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
        'GitHub',
        'Project',
        'organizationNameResolver',
        'popup',
        'gitHubTokenStore',
        function($http, $q, $window, $location, $browser, GitHub, Project, organizationNameResolver, popup, gitHubTokenStore) {
            return {
                restrict: 'E',
                scope: {
                    workspaces: '=',
                    currentUserId: '=',
                    newProjectData: '='
                },
                link: function($scope, element, attrs) {
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
                            return $scope.authenticateWithGitHub();
                        });
                    };
                    $scope.loadRepositories = function() {
                        $scope.loadingRepos = true;
                        $scope.gitHubError = false;

                        $scope.checkGitHubAuthentication().then(function() {
                            var user = GitHub.user().get();
                            $scope.organizations.push(user);
                            $scope.gitHubRepositories = GitHub.userRepositories().query();

                            var userOrganizations = GitHub.organizations().query();
                            userOrganizations.$promise.then(function (data) {
                                $scope.organizations = $scope.organizations.concat(data);

                                for (var i = 0; i < data.length; i++) {
                                    GitHub.organizationRepositories(data[i].login).query(function (data) {
                                        $scope.gitHubRepositories = $scope.gitHubRepositories.concat(data);
                                    });
                                }
                            });

                            $scope.loadingRepos = false;
                            $scope.shouldDisplayLoadButton = false;
                        }, function() {
                            $scope.loadingRepos = false;
                            $scope.shouldDisplayLoadButton = true;
                            $scope.gitHubError = true;
                        });
                    };

                    $scope.selectRepository = function(gitHubRepository) {
                        var oldSelectedRepository = $scope.selectedRepository;
                        $scope.selectedRepository = gitHubRepository;

                        if (!$scope.newProjectData.projectName || (oldSelectedRepository && $scope.newProjectData.projectName == oldSelectedRepository.name)) {
                            $scope.newProjectData.projectName = gitHubRepository.name;
                        }
                        if (!$scope.newProjectData.projectDescription || (oldSelectedRepository && $scope.newProjectData.projectDescription == oldSelectedRepository.description)) {
                            $scope.newProjectData.projectDescription = gitHubRepository.description;
                        }
                        $scope.newProjectData.remoteUrl = gitHubRepository.clone_url ;
                    };

                    $scope.resolveOrganizationName = organizationNameResolver.resolve;

                    $scope.resolveOrganizationType = function(organization) {
                        return organization.name ? "Your account" : "Your organization's account";
                    };

                    $scope.workspaceSelected = $scope.workspaces[0];
                    $scope.organizations = [];
                    $scope.shouldDisplayLoadButton = true;
                    $scope.checkTokenValidity().then(function() {
                        $scope.loadRepositories();
                    });
                },
                templateUrl: 'partials/widgets/importGitHub.html'
            };
        }
    ]);
