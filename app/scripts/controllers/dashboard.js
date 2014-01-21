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
    .controller('DashboardCtrl', function ($scope, $http) {
        
        //an example showing simple rest consumption
        /*$http.get('/api/awesomeThings').success(function(awesomeThings) {
            $scope.awesomeThings = awesomeThings;
        });*/
        $scope.box = 1;
        $scope.search = 0;
        setTimeout(function(){
            $("[rel=tooltip]").tooltip({ placement: 'bottom'});
        },50);
        
        $scope.projects = [
            {
                'icon': 'images/icon-spring.png',
                'name': 'SpringDemo',
                'owner': 'Stevan.lemur',
                'description': 'This project is demoing a Java application built with Spring. Displaying data in a page, submitting data and authentication sample',
                'visibility' : 'Public',
                'modified': 1
            },
            {
                'icon': 'images/icon-angular.png',
                'name': 'AngularDemo',
                'owner': 'Stevan.lemur',
                'description': 'This project is demoing a Java application built with Spring. Displaying data in a page, submitting data and authentication sample',
                'visibility' : 'Private',
                'modified': 2
            },
            {
                'icon': 'images/icon-android.png',
                'name': 'AndroidCodeEnvy',
                'owner': 'Stevan.lemur',
                'description': 'This project is demoing a Java application built with Spring. Displaying data in a page, submitting data and authentication sample',
                'visibility' : 'Private',
                'modified': 3
            },
            {
                'icon': 'images/icon-node.png',
                'name': 'Book Store',
                'owner': 'Stevan.lemur',
                'description': 'This project is demoing a Java application built with Spring. Displaying data in a page, submitting data and authentication sample',
                'visibility' : 'Private',
                'modified': 4
            },
            {
                'icon': 'images/icon-spring.png',
                'name': 'SpringDemo',
                'owner': 'Stevan.lemur',
                'description': 'This project is demoing a Java application built with Spring. Displaying data in a page, submitting data and authentication sample',
                'visibility' : 'Public',
                'modified': 1
            },
            {
                'icon': 'images/icon-angular.png',
                'name': 'AngularDemo',
                'owner': 'Stevan.lemur',
                'description': 'This project is demoing a Java application built with Spring. Displaying data in a page, submitting data and authentication sample',
                'visibility' : 'Private',
                'modified': 2
            },
            {
                'icon': 'images/icon-android.png',
                'name': 'AndroidCodeEnvy',
                'owner': 'Stevan.lemur',
                'description': 'This project is demoing a Java application built with Spring. Displaying data in a page, submitting data and authentication sample',
                'visibility' : 'Private',
                'modified': 3
            },
            {
                'icon': 'images/icon-node.png',
                'name': 'Book Store',
                'owner': 'Stevan.lemur',
                'description': 'This project is demoing a Java application built with Spring. Displaying data in a page, submitting data and authentication sample',
                'visibility' : 'Private',
                'modified': 4
            }
        ];
    });
