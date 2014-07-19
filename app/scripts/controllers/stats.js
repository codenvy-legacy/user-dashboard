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
      
        var Data = [{x: '2012-11-16', y: 2, z: 6},
                                {x: '2012-11-18', y: 2, z: 4},
                                {x: '2012-11-20', y: 3, z: 3},
                                {x: '2012-11-24', y: 3, z: 4},
                                {x: '2012-11-26', y: 3, z: 5},
                                {x: '2012-11-28', y: 3, z: 6},
                                {x: '2012-11-30', y: 3, z: 8},
                                {x: '2012-12-01', y: 3, z: 4},
                                {x: '2012-12-03', y: 3, z: 7},
                                {x: '2012-12-05', y: 3, z: 10},
                                {x: '2012-12-07', y: 3, z: 9},
                                {x: '2012-12-09', y: 3, z: 11},
                                {x: '2012-12-11', y: 3, z: 12},
                                {x: '2012-12-13', y: 3, z: 13},
                                {x: '2012-12-15', y: 3, z: 14},
                                {x: '2012-12-18', y: 3, z: 15},
                                ];
        setTimeout(function () {
            Morris.Area({element: 'graph-area-line',
                         behaveLikeLine: false,
                         data: Data,
                         xkey: 'x',
                         ykeys: ['z'],
                         labels: ['Z'],
                         grid:false,
                         lineWidth:1,
                         smooth:false,
                         goals:[0],
                         xLabels:'day',
                         hoverCallback: function(index, options, content) {
                            var row = options.data[index];
                            return "<div class='morris-hover-row-label'>"+row.z+" Sessions</div><div class='morris-hover-point'>235 Minutes</div>";
                        },
                         goalLineColors:['#d9d9d9'],
                         eventLineColors:['#d9d9d9'],
                         events:[Data[0].x],
                         pointSize:5,
                         pointFillColors:['#ffffff'],
                         pointStrokeColors:['#90c6ec'],
                         lineColors: ['#eff4f8']});
            if ($(".sparkline").length > 0) {
                $(".sparkline").sparkline('html', { enableTagOptions: true, disableHiddenCheck: true});
            }
        }, 50);
    });
