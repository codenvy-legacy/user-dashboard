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
 * This script will contain all controller related to account section
 */

/*global angular, $*/

var firstNameDescription = "";
var lastNameDescription = "";
var emailDescription = "";
var phoneDescription = "";
var countryDescription = "";
var companyNameDescription = "";
var departmentNameDescription = "";
var jobTitleDescription = "";

'use strict';
angular.module('odeskApp')
    .controller('AccountConfigCtrl', function ($scope, Profile, Password) {        
        /*Profile.query(function (resp) {
            $scope.attributes = resp.attributes;
        });*/
		
		Profile.query().then(function (resp) {
			
			resp.attributes.forEach(function(as){
				if(as.name=='firstname')
				{
					$scope.firstName = as.value;
					firstNameDescription = as.description;
				}
				if(as.name=='lastname')
				{
					$scope.lastName = as.value;
					lastNameDescription = as.description;
				}
				if(as.name=='email')
				{
					$scope.email = as.value;
					emailDescription = as.description;
				}
				if(as.name=='phone')
				{
					$scope.phone = as.value;
					phoneDescription = as.description;
				}
				if(as.name=='country')
				{
					$scope.country = as.value;
					countryDescription = as.description;
				}
				if(as.name=='companyname')
				{
					$scope.companyName = as.value;
					companyNameDescription = as.description;
				}
				if(as.name=='departmentname')
				{
					$scope.departmentName = as.value;
					departmentNameDescription = as.description;
				}
				if(as.name=='jobtitle')
				{
					$scope.jobTitle = as.value;
					jobTitleDescription = as.description;
				}
			});
			
			var salesContactArray = [];
			var userSkillsArray = [];
			
			$.each(resp.preferences, function (key, dat) {
				if(/contact_/i.test(key))
				{
					salesContactArray.push(dat);
				}
			});
			
			$.each(resp.preferences, function (key, dat) {
				if(/skill_/i.test(key))
				{
					userSkillsArray.push(dat);
				}
			});
			
				$scope.salesContactOptions = salesContactArray;
				$scope.userSkills = userSkillsArray;
        });
        
        $scope.updateProfile = function () {
			appValue = [
				{
					"name": "firstname",
					"value": $scope.firstName,
					"description": firstNameDescription
				},
				{
					"name": "lastname",
					"value": $scope.lastName,
					"description": lastNameDescription
				},
				{
					"name": "email",
					"value": $scope.email,
					"description": emailDescription
				},
				{
					"name": "phone",
					"value": $scope.phone,
					"description": phoneDescription
				},
				{
					"name": "country",
					"value": $scope.country,
					"description": countryDescription
				},
				{
					"name": "companyname",
					"value": $scope.companyName,
					"description": companyNameDescription
				},
				{
					"name": "departmentname",
					"value": $scope.departmentName,
					"description": departmentNameDescription
				},
				{
					"name": "jobtitle",
					"value": $scope.jobTitle,
					"description": jobTitleDescription
				}
			];
            Profile.update(appValue);
        };
            
        $scope.updatePassword = function () {
            if ($scope.password === $scope.password_verify) {
                Password.update($scope.password);
            } else {
                alert("password don't match");
            }
        };
    });
