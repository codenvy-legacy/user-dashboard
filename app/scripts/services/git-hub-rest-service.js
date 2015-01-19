/*jslint
 browser: true,
 devel:true ,
 node:true,
 nomen: true,
 es5:true
 */

/**
 * @auth Stéphane Daviet
 * @date 12/04/2014
 * service
 */

/*global angular*/
'use strict';

angular.module('odeskApp')
  .factory('gitHubTokenStore', function() {
    return {
      setToken: function(token) {
        localStorage.setItem('gitHubToken', token);
      },
      getToken: function() {
        return localStorage.getItem('gitHubToken');
      }
    }
  }).factory('GitHubHeadersInjectorInterceptor', ['$q', 'gitHubTokenStore', function($q, gitHubTokenStore) {
    return {
      request: function(config) {
        if (config.url.indexOf('https://api.github.com') == 0) {
          config.headers['Accept'] = 'application/vnd.github.v3+json';

          var token = gitHubTokenStore.getToken();
          if (token) {
            config.headers['Authorization'] = 'token ' + token;
          }
        }
        return config;
      }
    };
  }]).config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('GitHubHeadersInjectorInterceptor');
  }]).factory('GitHub', ['$resource', function($resource) {
    return {
        user : function() {
          return $resource('https://api.github.com/user');
        },
        organizations : function() {
          return $resource('https://api.github.com/user/orgs');
        },
        userRepositories : function() {
          return $resource('https://api.github.com/user/repos', {sort: 'full_name'});
        },
        organizationRepositories : function(organizationLogin) {
          return $resource('https://api.github.com/orgs/:organizationLogin/repos', {organizationLogin: organizationLogin, sort: 'full_name'})
        }
      }
  }]);
