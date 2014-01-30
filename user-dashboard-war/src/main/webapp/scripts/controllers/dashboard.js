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
 * Controller for dashboard/projects
 */

/*global angular*/

'use strict';

angular.module('odeskApp')
    .controller('DashboardCtrl', function ($scope, demoService) {
        
        //an example showing simple rest consumption
        /*$http.get('/api/awesomeThings').success(function(awesomeThings) {
            $scope.awesomeThings = awesomeThings;
        });*/
        $scope.box = 1;
        $scope.search = 0;
        setTimeout(function(){
            $("[rel=tooltip]").tooltip({ placement: 'bottom'});
        },50);
        
        $scope.projects = demoService;
    });
