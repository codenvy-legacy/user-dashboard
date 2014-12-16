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
    .factory('GitHub', ['$resource', function($resource) {
        return {
            user : function() {
                return $resource('https://api.github.com/user');
            },
            organizations : function() {
                return $resource('https://api.github.com/user/orgs');
            },
            userRepositories : function() {
                return $resource('https://api.github.com/user/repos');
            },
            organizationRepositories : function(organizationLogin) {
                return $resource('https://api.github.com/orgs/:organizationLogin/repos', {organizationLogin: organizationLogin})
            }
        }
    }]);
