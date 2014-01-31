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

/*global angular, Morris, $*/

'use strict';

angular.module('odeskApp')
    .controller('StatsCtrl', function ($scope, $http) {
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
                         lineColors: ['#66ccff', '#E67A77']});
            if ($(".sparkline").length > 0) {
                $(".sparkline").sparkline('html', { enableTagOptions: true, disableHiddenCheck: true});
            }
        }, 50);
    });
