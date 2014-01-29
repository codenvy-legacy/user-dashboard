/*jslint
    browser: true,
    devel:true ,
    node:true,
    nomen: true,
    es5:true
*/

/**
 * @auth Gaurav Meena
 * @date 01/16/2014
 * stats page controller
 */

/*global angular*/

'use strict';

angular.module('odeskApp')
    .controller('StatsCtrl', function ($scope, $http) {
        $scope.awesomeThings = [
            {
                'name': 'Stats',
                'info': 'info'
            }
        ];
    });
