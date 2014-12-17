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
    .controller('NavbarCtrl', function ($scope, $location, $http, $cookies, $window, Account, $q) {

        $scope.menu = [
            /*//{
            //    'title': 'Admin',
            //    'link': '#/admin'
            //},*/
            {
                'title': 'Projects',
                'link': '#/dashboard'
            },
            {
                'title': 'Runners',
                'link': '#/runner'
            },
            /*{
                'title': 'Factories',
                'link': '#/factories'
            },
            {
                'title': 'Stats',
                'link': '#/stats'
            },*/
            {
                'title': 'Account',
                'link': '#/account'
            }
        ];

		$scope.helpMenu = [
            {
                'title': 'Codenvy Help',
                'link': 'http://docs.codenvy.com'
            },
            {
                'title': 'Forum',
                'link': 'http://helpdesk.codenvy.com/'
            },
            {
                'title': 'Feedback and Feature Vote',
                'link': 'https://codenvy.uservoice.com/'
            },
            {
                'title': 'Create Support Ticket',
                'link': 'https://codenvy.uservoice.com/'
            }
            ];

        var accountId = [];
        var serviceIds = ["Saas", "OnPremises"];
        var packages = ["Team", "Enterprise"];

        $http({method: 'GET', url: '/api/profile'}).success(function (profile, status) {
          if (profile.attributes.firstName && profile.attributes.lastName) {
            $scope.fullUserName = profile.attributes.firstName + ' ' + profile.attributes.lastName;
          } else {
            $scope.fullUserName = profile.attributes.email;
          }
        });

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

        $scope.logout = function () {
            $http({
                url: "/api/auth/logout",
                method: "POST",
                data: { "token": $cookies['session-access-key']}
            }).success(function (data, status) {
                $window.location.href = '/site/login';
            });
        };
        $("#navbar-collapse").click(function(){
            $(".navbar-collapse").toggle();
        });
        $("#navbar-collapse-btn").click(function(){
            $(".navbar-collapse").toggle();
        });
 
 	return $q.all([
          Account.getAccountId().then(function (response) {
            angular.forEach(response, function(resp) {
               $scope.userRole = resp.roles[0];
               $scope.account_id = resp.accountReference.id;
               if($scope.userRole == 'account/owner'){
                 accountId.push($scope.account_id);
               }
            })
          })
        ]).then(function () {
            angular.forEach(accountId , function (acc_id){
              Account.getSubscription(acc_id).then(function (response){ 
                var serviceId = _.pluck(response, 'serviceId')[0];
                var packageName = _.pluck(_.pluck(response, 'properties'),'Package')[0];
                if(_.contains(serviceIds, serviceId) && _.contains(packages, packageName)) {
                  var organizationLink = {
                    'title': 'Organization',
                    'link': '#/organizations'
                  };
                  var already= _.find($scope.menu, function(menu){ if(menu.title == organizationLink.title && menu.link == organizationLink.link) return menu; });
                    if((typeof(already)=="undefined")){
                      $scope.menu.push(organizationLink);
                      }
                }
              });
            });
        });
    });
 