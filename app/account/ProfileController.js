/*jslint
 browser: true,
 devel:true ,
 node:true,
 nomen: true,
 es5:true
 */

/**
 * @auth Ann Shumilova
 * @date
 * Controller for manipulating user's Profile.
 */
angular.module('odeskApp')
    .controller('ProfileCtrl', ["$scope", "ProfileService", "AccountService", "Countries", "Password", "$rootScope", function ($scope, ProfileService, AccountService, Countries, Password, $rootScope) {
        $scope.userSkills = [];
        $scope.countries = Countries.all();
        $scope.country = Countries.default();
        $scope.userSkills = [];
        $scope.profile = {};
        $scope.preferences = {};
        $scope.skillsPreloader = false;

        ProfileService.getProfile().then(function () {

            $scope.profile = ProfileService.profile;
            console.log( $scope.profile);

            $scope.firstName = $scope.profile.attributes.firstName;
            $scope.lastName = $scope.profile.attributes.lastName;
            $scope.email = $scope.profile.attributes.email;
            $scope.phone = $scope.profile.attributes.phone ;
            $scope.country = $scope.profile.attributes.country;
            $scope.companyName = $scope.profile.attributes.employer;
            $scope.departmentName = $scope.profile.attributes.departmentname;
            $scope.jobTitle = $scope.profile.attributes.jobtitle;
            $scope.sales = $scope.profile.attributes["sales_can_contact"] ? $scope.profile.attributes["sales_can_contact"] == "true" : false;
        });

        ProfileService.getPreferences().then(function () {
            $scope.preferences = ProfileService.preferences;
            $.each($scope.preferences, function (key, data) {
                if (/skill_/i.test(key)) {
                    $scope.userSkills.push({'key': key, 'name': data});
                }
            });

            $scope.usage_1 = $scope.preferences.usage_1 ? $scope.preferences.usage_1 == "true" : false;
            $scope.usage_2 = $scope.preferences.usage_2 ? $scope.preferences.usage_2 == "true" : false;
            $scope.usage_3 = $scope.preferences.usage_3 ? $scope.preferences.usage_3 == "true" : false;
            $scope.usage_4 = $scope.preferences.usage_4 ? $scope.preferences.usage_4 == "true" : false;
            $scope.usage_5 = $scope.preferences.usage_5 ? $scope.preferences.usage_5 == "true" : false;
            $scope.usage_6 = $scope.preferences.usage_6 ? $scope.preferences.usage_6 == "true" : false;

            $scope.project_1 = $scope.preferences.project_1 ? $scope.preferences.project_1 == "true" : false;
            $scope.project_2 = $scope.preferences.project_2 ? $scope.preferences.project_2 == "true" : false;
            $scope.project_3 = $scope.preferences.project_3 ? $scope.preferences.project_3 == "true" : false;
            $scope.project_4 = $scope.preferences.project_4 ? $scope.preferences.project_4 == "true" : false;

        });

        $scope.addSkill = function () {
            if ($scope.addSkillModel != '') {
                $scope.skillsPreloader = true;
                var next_key = "skill_" + ($scope.userSkills.length + 1);
                var skills = {};
                skills[next_key] = $scope.addSkillModel;
                ProfileService.updatePreferences(skills).then(function () {
                    //TODO need to process errors
                    $scope.skillsPreloader = false;
                    $scope.userSkills.push({'key': next_key, 'name': $scope.addSkillModel});
                    $scope.addSkillModel = "";
                    $('#skill-name').focus();
                });
            }
        }

        $scope.removeSkill = function (skill) {
            $scope.userSkills = _.without($scope.userSkills, _.findWhere($scope.userSkills,  skill));
            ProfileService.removePreference(new Array(skill.key)).then(function() {
                //TODO need to process errors
            });
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
            ProfileService.updatePreferences(usageData).then(function () {
                $('#btn-preloader4').removeClass('preloader');
                $('#btn4').removeClass('btn-disabled');
                //TODO process errors
            });
        };

        $scope.updatePassword = function () {
            if ($scope.password === $scope.password_verify) {
                $('#btn-preloader2').addClass('preloader');
                $('#btn2').addClass('btn-disabled');
                $('#doesNotMatch').hide();
                $('#password1').css('border', '1px solid #e5e5e5');
                $('#password2').css('border', '1px solid #e5e5e5');
                Password.update($scope.password);
                if ($scope.profile.attributes.resetPassword && $scope.profile.attributes.resetPassword == "true") {
                    ProfileService.updateProfile({resetPassword: 'false'}).then(function () {
                        $cookieStore.remove('resetPassword');
                    });
                } else {
                    $('#doesNotMatch').show();
                    $('#doesNotMatch').mouseout(function () {
                        $(this).fadeOut('slow');
                    });
                    $('#password1').css('border', '1px solid #a94442');
                    $('#password2').css('border', '1px solid #a94442');
                }
            }
            ;
        }


        $scope.updateProfile = function () {
            var filter = /^[0-9-+]+$/;
            if (filter.test($scope.phone) && $scope.phone.length>=10 && $scope.phone.length<=20) {
                $('#phone').css('border', '1px solid #e5e5e5');
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
                    "sales_can_contact": $scope.sales
                }

                ProfileService.updateProfile(appValue)
                    .then(function (profile, status) {
                        //TODO process error
                        $('#btn-preloader1').removeClass('preloader');
                        $('#btn1').removeClass('btn-disabled');
                        var fullUserName;
                        if (profile.attributes.firstName && profile.attributes.lastName) {
                            fullUserName = profile.attributes.firstName + ' ' + profile.attributes.lastName;
                        } else {
                            fullUserName = profile.attributes.email;
                        }
                        $rootScope.$broadcast('update_fullUserName', fullUserName);// update User name at top
                    });
            }
            else {
                $('#phone').css('border', '1px solid #a94442');
                return false;
            }

        }

    }]);
