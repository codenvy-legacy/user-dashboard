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
 * Controller for factories
 */

/*global angular*/

'use strict';

angular.module('odeskApp')
    .controller('FactoriesCtrl', function ($scope, $http) {
        $scope.awesomeThings = [
            {
                'name': 'Factories',
                'info': 'info'
            }
        ];
    });
