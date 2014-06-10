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

var skillNo = 0;
var dataPreferences;

'use strict';
angular.module('odeskApp')
    .controller('AccountConfigCtrl', function ($scope, Profile, Password, addSkill, removeSkills) {        
        /*Profile.query(function (resp) {
            $scope.attributes = resp.attributes;
        });*/
		
		Profile.query().then(function (resp) {
		
			dataPreferences = resp.preferences;
			
			resp.attributes.forEach(function(as){
				if(as.name=='firstName')
				{
					$scope.firstName = as.value;
					firstNameDescription = as.description;
				}
				if(as.name=='lastName')
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
				if(as.name=='employer')
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
				if(as.name=='sales_can_contact')
				{
					if(as.value=="true") {
						$scope.check = true;
					}
					else {
						$scope.check = false;
					}
				}
			});
			
			var salesContactArray = [];
			var userSkillsArray = [];
			
			/*$.each(resp.preferences, function (key, dat) {
				if(/contact_/i.test(key))
				{
					salesContactArray.push(dat);
				}
			});*/
			
			$.each(resp.preferences, function (key, dat) {
				if(/skill_/i.test(key))
				{
					userSkillsArray.push(dat);
					skill_part = key.split('_');
					skillNo = skill_part[1];
					$scope.skillId = parseInt(skillNo) + 1;
				}
			});
			
				$scope.salesContactOptions = salesContactArray;
				$scope.userSkills = userSkillsArray;
        });
        
        $scope.updateProfile = function () {
			var appValue = [
				{
					"name": "firstName",
					"value": $scope.firstName,
					"description": firstNameDescription
				},
				{
					"name": "lastName",
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
					"name": "employer",
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
				},
				{
					"name": "sales_can_contact",
					"value": $scope.check,
					"description": "Sales are able to contact this user"
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
		
		$scope.addSkill = function () {
			var skillNow = parseInt(skillNo) + 1;
			var skillData = {};
			skillData["skill_"+skillNow] = $scope.addSkillModel;
			addSkill.query(skillData).then();
		};
		
		$scope.removeSkill = function (skill) {
			$.each(dataPreferences, function(key, val) {
				if(val==skill)
				{
					delete dataPreferences[key];
				}
			});
			
			removeSkills.update(dataPreferences);
		};
    });
