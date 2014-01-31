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
    .controller('FactoriesCtrl', function ($scope, demoService) {
        $scope.projects = demoService;
        setTimeout(function () {
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
                         lineColors: ['#79D1CF', '#E67A77']});

        }, 50);
    });
