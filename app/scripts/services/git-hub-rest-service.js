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
    .constant('gitHubApiUrlRoot', 'https://api.github.com')
    .constant('gitHubApiVersionHeader', 'application/vnd.github.moondragon+json')
    .factory('gitHubTokenStore', function() {
      return {
        setToken: function (token) {
          localStorage.setItem('gitHubToken', token);
        },
        getToken: function () {
          return localStorage.getItem('gitHubToken');
        }
      }
    }).factory('gitHubApiUtils', ['gitHubApiUrlRoot', function(gitHubApiUrlRoot) {
      /**
       * Util function to parse a concatenated GitHub Link header value and return a object with rel value as properties and associated URL
       * as values.
       *
       * For instance, passing "<https://api.github.com/user/repos?per_page=5&sort=full_name&page=2>; rel="next" \
       *    , <https://api.github.com/user/repos?per_page=5&sort=full_name&page=10>; rel="last"" gives back:
       *   {
       *     next: 'https://api.github.com/user/repos?per_page=5&sort=full_name&page=2',
       *     last: 'https://api.github.com/user/repos?per_page=5&sort=full_name&page=10'
       *   }
       *
       * @param linkHeaderValue the value of the HTTP Link header to parse. {} is returned for null, empty, undefined or unparsable value
       * @returns a map kind object rel_value: URL
       */
      function parseLinkHeader(linkHeaderValue) {
        var extractor = new RegExp('(<([^;]+)>;\\s?rel="(\\w+)")', 'g');
        // Sample Link Header content
        // "<https://api.github.com/user/repos?per_page=5&sort=full_name&page=2>; rel="next" \
        //   , <https://api.github.com/user/repos?per_page=5&sort=full_name&page=10>; rel="last""
        var links = {};
        var extraction;
        while ((extraction = extractor.exec(linkHeaderValue)) !== null) {
          links[extraction[3]]= extraction[2];
        }
        return links;
      }

      /**
       * Check is the URL is targeted to GitHub REST API.
       *
       * @param url the URL to check
       * @returns true if targeted to GitHub API, false either
       */
      function isGitHubApiUrl(url) {
        return url && url.indexOf(gitHubApiUrlRoot) == 0;
      }

      return {
        parseLinkHeader: parseLinkHeader,
        isGitHubApiUrl: isGitHubApiUrl
      }
    }]).factory('GitHubHeadersInjectorInterceptor', ['$q', 'gitHubTokenStore', 'gitHubApiUtils', function($q, gitHubTokenStore, gitHubApiUtils) {
      /**
       * Inject the token inside config as HTTP request header if the request is targeted to http://api.github.com.
       *
       * @param config the classic request config object
       * @returns the config passed a input param with token injected inside if needed
       */
      function injectToken(config) {
        if (gitHubApiUtils.isGitHubApiUrl(config.url)) {
          var token = gitHubTokenStore.getToken();
          if (token) {
            config.headers['Authorization'] = 'token ' + token;
          }
        }
        return config;
      }

      return {
        request: injectToken
      }
    }]).factory('GitHubUnpaginateInterceptor', ['$q', '$injector', 'gitHubApiUtils', function($q, $injector, gitHubApiUtils) {
      /**
       * Unpaginate GitHub API request when it can. It means:
       * - detect if the url is targeted to http://api.github.com, unless return direct response,
       * - detect if URL headers contain a Link one with a rel="next", unless return direct response, endpoint of recursion in case of
       * unpagination (see below explanation).
       * - call this next page link to retrieve next page of result and concat it to first response.
       *
       * All the pages would be indirectly recursively retrieved by subsequent activation of the interceptor for next pages requests, which
       * will concatenate themselves to previous one and so on, until the last one with no next link is retrieved.
       *
       * @param response the classic response object
       * @returns a response with unpaginated results in possible
       */
      function unpaginate(response) {
        if (!gitHubApiUtils.isGitHubApiUrl(response.config.url)) {
          return response;
        }
        var nextUrl = gitHubApiUtils.parseLinkHeader(response.headers('Link'))['next'];
        if (!nextUrl) {
          return response;
        }
        var $http = $injector.get('$http');
        return $http({
          url: nextUrl,
          method: 'GET',
          transformResponse: $http.defaults.transformResponse.concat([function (data) {
            return response.data.concat(data);
          }])
        });
      }

      return {
        response: unpaginate
      }
    }]).factory('GitHubAPIVersionSetterInterceptor', ['$q', 'gitHubApiUtils', 'gitHubApiVersionHeader', function($q, gitHubApiUtils, gitHubApiVersionHeader) {
      /**
       * Set the right header to indicate to GitHub API the targeted version.
       *
       * @param config the classic request config object
       */
      function setGitHubApiVersionHeader(config) {
        if (gitHubApiUtils.isGitHubApiUrl(config.url)) {
          config.headers['Accept'] = gitHubApiVersionHeader;
        }
        return config;
      }

      return {
        request: setGitHubApiVersionHeader
      }
    }]).config(['$httpProvider', function($httpProvider) {
      $httpProvider.interceptors.push('GitHubHeadersInjectorInterceptor');
      $httpProvider.interceptors.push('GitHubUnpaginateInterceptor');
      $httpProvider.interceptors.push('GitHubAPIVersionSetterInterceptor');
    }]).factory('GitHub', ['$resource', function($resource) {
      var sort = 'full_name';
      var per_page = 100;
      return {
          user : function() {
            return $resource('https://api.github.com/user');
          },
          organizations : function() {
            return $resource('https://api.github.com/user/orgs');
          },
          userRepositories : function() {
            return $resource('https://api.github.com/user/repos', {sort: sort, per_page: per_page});
          },
          organizationRepositories : function(organizationLogin) {
            return $resource('https://api.github.com/orgs/:organizationLogin/repos', {organizationLogin: organizationLogin, sort: sort, per_page: per_page})
          }
        }
    }]);
