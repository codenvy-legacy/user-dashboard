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
                         data: [{x: '2012 Q1', y: 3, z: 3},
                                {x: '2012 Q2', y: 2, z: 1},
                                {x: '2011 Q3', y: 2, z: 4},
                                {x: '2011 Q4', y: 3, z: 3},
                                {x: '2011 Q5', y: 3, z: 4}],
                         xkey: 'x',
                         ykeys: ['z'],
                         labels: ['Z'],
						 lineColors: ['#E1E3E2'],
						 fillOpacity : 1,
						 grid : false,
						 goals: [1.0, 0],
						 pointFillColors:'#ddd',
						 goalLineColors : ["#E2E2E2", "#E2E2E2"],
						 });
            		if ($(".sparkline").length > 0) {
                	$(".sparkline").sparkline('html', { enableTagOptions: true, disableHiddenCheck: true});
					//$('.barsparks').sparkline('html', { type:'bar', height:'40px', barWidth:5 });
            	}
        		}, 50);
    });
