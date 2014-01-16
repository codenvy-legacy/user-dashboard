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
 * This script will contain all controller related to account section
 */

/*global angular*/

'use strict';

angular.module('odeskApp')
    .controller('AccountConfigCtrl', function ($scope, $http) {
        /*$http.get('/api/awesomeThings').success(function(awesomeThings) {
            $scope.awesomeThings = awesomeThings;
        });*/
        $scope.awesomeThings = [
            {
                'name': 'Factories',
                'info': 'info'
            }
        ];
    });
