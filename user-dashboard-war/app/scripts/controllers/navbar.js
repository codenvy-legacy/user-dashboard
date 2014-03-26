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
 * Controller for navbar will automatically check for active view to set class active
 */

/*global angular*/

'use strict';

angular.module('odeskApp')
    .controller('NavbarCtrl', function ($scope, $location) {
        $scope.menu = [
            {
                'title': 'Projects',
                'link': '#/dashboard'
            },
            {
                'title': 'Factories',
                'link': '#/factories'
            },
            {
                'title': 'Stats',
                'link': '#/stats'
            },
            {
                'title': 'Account',
                'link': '#/account'
            }
        ];
    
        $scope.isActive = function (route) {
            //return route === '#' + $location.path(); //here # is added because of location html5 mode        
            var str = '#' + $location.path(),
                str2 = route;
            
            if (str.indexOf(str2) > -1) {
                return true;
            } else {
                return false;
            }
        };
    });
