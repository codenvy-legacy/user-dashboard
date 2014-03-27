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

/*global angular, $*/

'use strict';

angular.module('odeskApp')
    .controller('DashboardCtrl', function ($scope, $timeout, projectList) {
        
        $scope.box = 1;
        $scope.search = 0;
        $scope.projects = projectList.query();
        $scope.filter = {};
        $timeout(function () {
            $("[rel=tooltip]").tooltip({ placement: 'bottom'});
        $(document).on( "click", ".searchfield", function() {
            console.log('cl1');
            $('.searchfull').show();
            $('.detail').animate({ opacity: 0}, 400);
            $('.searchfull').animate({width: "100%" }, 400, function(){ $(".closeBtn").show(); } );
            
        });
        $(document).on( "click", ".closeBtn", function() {
            console.log('cl2');
            $(".closeBtn").hide();
            $('.detail').animate({ opacity: 1}, 400);
            $('.searchfull').animate({width: "43px" }, 400 , function(){ $('.searchfull').hide();   });
        });
//new code end

        });

        $scope.test = function () {
            console.log(this);
        };
        
    });

angular.module('odeskApp')
    .directive('stopEvent', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.bind(attr.stopEvent, function (e) {
                    e.stopPropagation();
                });
            }
        };
    });
