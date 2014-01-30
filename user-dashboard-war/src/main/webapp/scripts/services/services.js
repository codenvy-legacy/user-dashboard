/*jslint
    browser: true,
    devel:true ,
    node:true,
    nomen: true,
    es5:true
*/

/**
 * @auth Gaurav Meena
 * @date 01/30/2014
 * service 
 */

/*global angular*/
'use strict';

angular.module('odeskApp')
    .factory('demoService',  ['$resource', function ($resource) {
        /*return $resource('/api/v1/crosssummary', {servername: 'Infx'}, {
            query: {method: 'GET', params: {}, isArray: false}
        });
        */
        return [
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
                'owner': 'tjwell',
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
                'owner': 'tjwell',
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
    }]);