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

/*global angular, Morris*/

'use strict';

angular.module('odeskApp')
    .controller('FactoriesCtrl', function ($scope, $timeout, projectList) {
        $scope.projects = projectList.query();
        $scope.filter = {};
        $timeout(function () {
            Morris.Area({element: 'graph-area-line',
                         behaveLikeLine: false,
                         data: [{x: '2011 Q1', y: 3, z: 3},
                                {x: '2011 Q2', y: 2, z: 1},
                                {x: '2011 Q3', y: 2, z: 4},
                                {x: '2011 Q4', y: 3, z: 3},
                                {x: '2011 Q5', y: 3, z: 4}],
                         xkey: 'x',
                         ykeys: ['z'],
                         labels: ['Z'],
						 fillOpacity : 0,
						 grid : false,
						 goals : [0.0],
						//axes : true,
						 //barColors : "#000",
						// pointFillColors : "#fff" ,
						// pointSize : 4,
						goalLineColors : ["#E2E2E2", "#E2E2E2"],
                         lineColors: ["#E2E2E2", "#E2E2E2"]});

        });
    });
