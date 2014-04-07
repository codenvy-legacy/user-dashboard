/*jslint
    browser: true,
    devel:true ,
    node:true,
    nomen: true,
    es5:true
*/

/**
 * @auth Gaurav Meena
 * @date 01/30/2014
 * service 
 */

/*global angular*/
'use strict';

angular.module('odeskApp')
    .factory('projectList',  ['$resource', function ($resource) {
        return $resource('/api/workspace/all', {}, {
            query: {method: 'GET', params: {}, isArray: true}
        });
    }]);

angular.module('odeskApp')
    .factory('userProfile',  ['$resource', function ($resource) {
        return $resource('/api/profile', {}, {
            query: {method: 'GET', params: {}, isArray: true},
            update: {method: 'POST', params: {}, isArray: true}
        });
    }]);

angular.module('odeskApp')
    .factory('project',  ['$resource', function ($resource) {
        return $resource('/api/project/:workspaceID', {}, {
            query: {method: 'GET', params: {}, isArray: true}
        });
    }]);

angular.module('odeskApp')
    .factory('password',  ['$resource', function ($resource) {
        return $resource('/api/user/password', {}, {
            update: {method: 'POST', params: {}, isArray: false}
        });
    }]);