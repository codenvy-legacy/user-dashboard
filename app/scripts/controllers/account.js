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
var firstNameValue = "";

var lastNameDescription = "";
var lastNameValue = "";

var emailDescription = "";
var emailValue = "";

var phoneDescription = "";
var phoneValue = "";

var countryDescription = "";
var countryValue = "";

var companyNameDescription = "";
var companyNameValue = "";

var departmentNameDescription = "";
var departmentNameValue = "";

var jobTitleDescription = "";
var jobTitleValue = "";

var checkValue = "";

var dataPreferences;

'use strict';
angular.module('odeskApp')
    .controller('AccountConfigCtrl', function ($scope, $rootScope, $http, ProfileService, Countries, Password, $cookieStore, addUsage, Account) {

    $scope.userSkills = [];
	$scope.countries = Countries.all();
	$scope.country = Countries.default();
		

    $http({method: 'GET', url: '/api/account'}).success(function (account, status) {
      $http({method: 'GET', url: '/api/account/'+account[0].accountReference.id+'/subscriptions'}).success(function (subscription) {
        if( subscription[0].properties.Package=='Team' || subscription[0].properties.Package=='Enterprise' ) {
              $scope.accountType = 'PREMIUM';
            } else {
              $scope.accountType = 'FREE';
            }
      });
   });

        ProfileService.getProfile().then(function (resp) {
		
			dataPreferences = resp.preferences;
                  $.each(resp.attributes, function (as,val) {
			   if(as=='firstName')
                        {
                              $scope.firstName = val;
                              firstNameValue = val;
                              firstNameDescription = as;
                        }
                        if(as=='lastName')
                        {
                              $scope.lastName = val;
                              lastNameValue = val;
                              lastNameDescription = as;
                        }
                        if(as=='email')
                        {
                              $scope.email = val;
                              emailValue = val;
                              emailDescription = as;
                        }
                        if(as=='phone')
                        {
                              $scope.phone = val;
                              phoneValue = val;
                              phoneDescription = as;
                        }
                        if(as=='country')
                        {
                              $scope.country = val;
                              countryValue = val;
                              countryDescription = as;
                        }
                        if(as=='employer')
                        {
                              $scope.companyName = val;
                              companyNameValue = val;
                              companyNameDescription = as;
                        }
                        if(as=='departmentname')
                        {
                              $scope.departmentName = val;
                              departmentNameValue = val;
                              departmentNameDescription = as;
                        }
                        if(as=='jobtitle')
                        {
                              $scope.jobTitle = val;
                              jobTitleValue = val;
                              jobTitleDescription = as;
                        }
                        if(as=='sales_can_contact')
                        {
                              if(val=="true") {
                                    $scope.check = true;
                                    checkValue = true;
                              }
                              else {
                                    $scope.check = false;
                                    checkValue = false;
                              }
                        }
			});
			
			var salesContactArray = [];
			$scope.salesContactOptions = salesContactArray;
        });

        ProfileService.getPreferences().then(function (prefs) {
			$.each(prefs, function (key, skill) {
				if(/skill_/i.test(key))
				{
					$scope.userSkills.push({'key':key, 'name': skill});
				}
			});
			
			$.each(prefs, function (key, dat) {
				if(/usage_/i.test(key))
				{
					if(key=='usage_1') {
						if(dat=="true") {
							$scope.usage_1 = true;
						} else {
							$scope.usage_1 = false;
						}
					}
					if(key=='usage_2') {
						if(dat=="true") {
							$scope.usage_2 = true;
						} else {
							$scope.usage_2 = false;
						}
					}
					if(key=='usage_3') {
						if(dat=="true") {
							$scope.usage_3 = true;
						} else {
							$scope.usage_3 = false;
						}
					}
					if(key=='usage_4') {
						if(dat=="true") {
							$scope.usage_4 = true;
						} else {
							$scope.usage_4 = false;
						}
					}
					if(key=='usage_5') {
						if(dat=="true") {
							$scope.usage_5 = true;
						} else {
							$scope.usage_5 = false;
						}
					}
					if(key=='usage_6') {
						if(dat=="true") {
							$scope.usage_6 = true;
						} else {
							$scope.usage_6 = false;
						}
					}
				}
			});
			
			$.each(prefs, function (key, dat) {
				if(/project_/i.test(key))
				{
					if(key=='project_1') {
						if(dat=="true") {
							$scope.project_1 = true;
						} else {
							$scope.project_1 = false;
						}
					}
					if(key=='project_2') {
						if(dat=="true") {
							$scope.project_2 = true;
						} else {
							$scope.project_2 = false;
						}
					}
					if(key=='project_3') {
						if(dat=="true") {
							$scope.project_3 = true;
						} else {
							$scope.project_3 = false;
						}
					}
					if(key=='project_4') {
						if(dat=="true") {
							$scope.project_4 = true;
						} else {
							$scope.project_4 = false;
						}
					}
				}
			});
       });

        $scope.updateProfile = function () {
			if($scope.firstName!=firstNameValue || $scope.lastName!=lastNameValue || $scope.email!=emailValue || $scope.phone!=phoneValue || $scope.country!=countryValue || $scope.companyName!=companyNameValue || $scope.jobTitle!=jobTitleValue || $scope.check!=checkValue)
			{
				var filter = /^[0-9-+]+$/;
				if (filter.test($scope.phone) && $scope.phone.length>=10 && $scope.phone.length<=20) {
					$('#phone').css('border', '1px solid #e5e5e5');
					firstNameValue=$scope.firstName; lastNameValue=$scope.lastName; emailValue=$scope.email; phoneValue=$scope.phone; countryValue=$scope.country; companyNameValue=$scope.companyName; jobTitleValue=$scope.jobTitle; checkValue=$scope.check;
				$('#btn-preloader1').addClass('preloader');
				$('#btn1').addClass('btn-disabled');
				var appValue = {
                                    "firstName":$scope.firstName,
                                    "lastName":$scope.lastName,
                                    "email":$scope.email,
                                    "phone":$scope.phone,
                                    "country":$scope.country,
                                    "employer":$scope.companyName,
                                    "jobtitle":$scope.jobTitle,
                                    "sales_can_contact":$scope.check
                                    };

                    ProfileService.updateProfile(appValue)
                        .then(function (profile) {
                            $('#btn-preloader1').removeClass('preloader');
                            $('#btn1').removeClass('btn-disabled');
                            $('#upadateProfileAlert .alert-success').show();
                            $('#upadateProfileAlert .alert-danger').hide();
                            $('#upadateProfileAlert .alert').mouseout(function () { $(this).fadeOut('slow'); });
                            var fullUserName;
                            if (profile.attributes.firstName && profile.attributes.lastName) {
                                fullUserName = profile.attributes.firstName + ' ' + profile.attributes.lastName;
                            } else {
                                fullUserName = profile.attributes.email;
                            }
                            $rootScope.$broadcast('update_fullUserName', fullUserName);// update User name at top

                        }, function (error) {
                            $('#btn-preloader1').removeClass('preloader');
                            $('#btn1').removeClass('btn-disabled');
                            $('#upadateProfileAlert .alert-danger').show();
                            $('#upadateProfileAlert .alert-success').hide();
                            $('#upadateProfileAlert .alert').mouseout(function () { $(this).fadeOut('slow'); });
                        });
                } else {
                    $('#phone').css('border', '1px solid #a94442');
                    return false;
                }
				
			}
        };

        $scope.updatePassword = function () {
            if ($scope.password === $scope.password_verify) {
            	$('#btn-preloader2').addClass('preloader');
				$('#btn2').addClass('btn-disabled');
				$('#doesNotMatch').hide();
				$('#password1').css('border', '1px solid #e5e5e5');
				$('#password2').css('border', '1px solid #e5e5e5');
                Password.update($scope.password);
                ProfileService.getPreferences().then(function (data) {
                    if (data.resetPassword && data.resetPassword == "true") {
                        ProfileService.updatePreferences({'resetPassword': 'false'}).then(function () {
                            $cookieStore.remove('resetPassword');
                        });
                    }
                });
            } else {
                $('#doesNotMatch').show();
				$('#doesNotMatch').mouseout(function(){ $(this).fadeOut('slow'); });
				$('#password1').css('border', '1px solid #a94442');
				$('#password2').css('border', '1px solid #a94442');
            }
        };

        $scope.addSkill = function () {
            if($scope.addSkillModel!=''){
                $('#btn-preloader3').addClass('preloader');
                $('#btn3').addClass('btn-disabled');
                var next_key = "skill_" + ($scope.userSkills.length + 1);
                var skillset = {};
                skillset[next_key] = $scope.addSkillModel;
                ProfileService.updatePreferences( skillset ).then(function () {
                    $('#btn-preloader3').removeClass('preloader');
                    $('#btn3').removeClass('btn-disabled');
                    $('#addSkillsAlert .alert-success').show();
                    $('#addSkillsAlert .alert-danger').hide();
                    setTimeout(function () { $('#addSkillsAlert .alert').fadeOut('slow'); }, 3000);
                }, function (error) {
                    $('#btn-preloader3').removeClass('preloader');
                    $('#addSkillsAlert .alert-danger').show();
                    $('#addSkillsAlert .alert-success').hide();
                    setTimeout(function () { $('#addSkillsAlert .alert').fadeOut('slow'); }, 3000);
                });

                $scope.userSkills.push({'key': next_key, 'name': $scope.addSkillModel});
                $scope.addSkillModel = "";
                $('#skill-name').focus();
            }
        };
		
		$scope.removeSkill = function (skill) {
        $scope.userSkills = _.without($scope.userSkills, _.findWhere($scope.userSkills,  skill));
            ProfileService.removeSkill(skill.key).then(function () {
                $('#removeSkillsAlert .alert-success').show();
                $('#removeSkillsAlert .alert-danger').hide();
                setTimeout(function () { $('#removeSkillsAlert .alert').fadeOut('slow'); }, 3000);
            }, function (err) {
                $('#removeSkillsAlert .alert-danger').show();
                $('#removeSkillsAlert .alert-success').hide();
                setTimeout(function () { $('#removeSkillsAlert .alert').fadeOut('slow'); }, 3000);
            });
		};

            
      // add workspace configuration
            $scope.workspaces=[];
            $scope.ramDetails =[];
            $scope.account_id='';
            $scope.workspace_name ='';
            $scope.workspaceId ='';
            $scope.runner_lifetime ='';
            $scope.builder_execution_time ='';
            $scope.getWorkspaceInfoId='';
              $scope.runner_ram ='';
              var user_id;

            $http({method: 'GET', url: '/api/workspace/all'}).success(function(workspaces){

                  angular.forEach(workspaces, function (workspace) {
                    // only take the workspaces where the user is workspace/admin
                    var isWorkspaceOwner = false;
                    for (var iRoles = workspace.roles.length - 1; iRoles >= 0; iRoles--) {
                        if (workspace.roles[iRoles] == "workspace/admin") isWorkspaceOwner=true;
                    }

                    console.log(workspace);
                    if (isWorkspaceOwner && (workspace.workspaceReference.temporary == false)) {$scope.workspaces.push(workspace.workspaceReference)}; 
                    
                  });  
                $scope.getWorkspaceInfoId=$scope.workspaces[0].id;
                $scope.getWorkspaceInfo ();
              
            }).error(function(err){

            });

            $scope.getWorkspaceInfo=function()
            {
               
                $scope.workspaceId = $scope.getWorkspaceInfoId;
                $scope.workspaceInfo={'builder':{'type':'','threshold':'','ram':''},
                                      'runner':{'type':'','threshold':'','ram':'','alwaysOn':''}
                                  };

                // Add default values for Builder
                $scope.workspaceInfo.builder.type='Global Shared';
                $scope.workspaceInfo.builder.ram='256';
                $scope.workspaceInfo.builder.threshold='10';


                // Add default values for Runner
                $scope.workspaceInfo.runner.type='Global Shared';
                $scope.workspaceInfo.runner.type='Dedicated';
                $scope.workspaceInfo.runner.threshold='5 mins';
                $scope.workspaceInfo.runner.ram='256';
                $scope.workspaceInfo.runner.alwaysOn='No';

                $http({method: 'GET', url: '/api/workspace/'+$scope.workspaceId}).success(function(data) {    
                    if (data.attributes['codenvy:runner_ram'] !== undefined) {

                        $scope.workspaceInfo.builder.type='Dedicated';
                        $scope.workspaceInfo.builder.threshold=Math.floor(data.attributes['codenvy:builder_execution_time']/60);
                        $scope.workspaceInfo.builder.ram=data.attributes['codenvy:runner_ram'];

                    
                        $scope.workspaceInfo.runner.type='Dedicated';
                        $scope.workspaceInfo.runner.ram=data.attributes['codenvy:runner_ram'];
                        $scope.workspaceInfo.runner.alwaysOn='';

                        //If Always-On Subscription
                        if(data.attributes['codenvy:runner_lifetime']==-1) {
                            $scope.workspaceInfo.runner.alwaysOn='Yes';
                            $scope.workspaceInfo.runner.threshold='Unlimited';
                        }
                        else {
                            $scope.workspaceInfo.runner.alwaysOn='No';
                            $scope.workspaceInfo.runner.threshold=Math.floor(data.attributes['codenvy:runner_lifetime']/60) + ' mins';
                        }
                    }
                  }).error(function(err){ });
            }

            


$scope.addUsage = function () {
			$('#btn-preloader4').addClass('preloader');
			$('#btn4').addClass('btn-disabled');
			var usageData = {
				"usage_1": $scope.usage_1,
				"usage_2": $scope.usage_2,
				"usage_3": $scope.usage_3,
				"usage_4": $scope.usage_4,
				"usage_5": $scope.usage_5,
				"usage_6": $scope.usage_6,
				"project_1": $scope.project_1,
				"project_2": $scope.project_2,
				"project_3": $scope.project_3,
				"project_4": $scope.project_4
			};
			addUsage.update(usageData);
		};
    });
