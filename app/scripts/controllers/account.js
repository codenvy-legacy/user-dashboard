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

var skillNo = 0;
var dataPreferences;
var allSkillIds = [];

'use strict';
angular.module('odeskApp')
    .controller('AccountConfigCtrl', function ($scope, $http, Profile, Password, addSkill, removeSkills, addUsage, Users, Account) {        
        /*Profile.query(function (resp) {
            $scope.attributes = resp.attributes;
        });*/
    $scope.userSkills = [];
		$scope.countries = [
      { name: 'Afghanistan', code: 'AF' },
      { name: 'Åland Islands', code: 'AX' },
      { name: 'Albania', code: 'AL' },
      { name: 'Algeria', code: 'DZ' },
      { name: 'American Samoa', code: 'AS' },
      { name: 'AndorrA', code: 'AD' },
      { name: 'Angola', code: 'AO' },
      { name: 'Anguilla', code: 'AI' },
      { name: 'Antarctica', code: 'AQ' },
      { name: 'Antigua and Barbuda', code: 'AG' },
      { name: 'Argentina', code: 'AR' },
      { name: 'Armenia', code: 'AM' },
      { name: 'Aruba', code: 'AW' },
      { name: 'Australia', code: 'AU' },
      { name: 'Austria', code: 'AT' },
      { name: 'Azerbaijan', code: 'AZ' },
      { name: 'Bahamas', code: 'BS' },
      { name: 'Bahrain', code: 'BH' },
      { name: 'Bangladesh', code: 'BD' },
      { name: 'Barbados', code: 'BB' },
      { name: 'Belarus', code: 'BY' },
      { name: 'Belgium', code: 'BE' },
      { name: 'Belize', code: 'BZ' },
      { name: 'Benin', code: 'BJ' },
      { name: 'Bermuda', code: 'BM' },
      { name: 'Bhutan', code: 'BT' },
      { name: 'Bolivia', code: 'BO' },
      { name: 'Bosnia and Herzegovina', code: 'BA' },
      { name: 'Botswana', code: 'BW' },
      { name: 'Bouvet Island', code: 'BV' },
      { name: 'Brazil', code: 'BR' },
      { name: 'British Indian Ocean Territory', code: 'IO' },
      { name: 'Brunei Darussalam', code: 'BN' },
      { name: 'Bulgaria', code: 'BG' },
      { name: 'Burkina Faso', code: 'BF' },
      { name: 'Burundi', code: 'BI' },
      { name: 'Cambodia', code: 'KH' },
      { name: 'Cameroon', code: 'CM' },
      { name: 'Canada', code: 'CA' },
      { name: 'Cape Verde', code: 'CV' },
      { name: 'Cayman Islands', code: 'KY' },
      { name: 'Central African Republic', code: 'CF' },
      { name: 'Chad', code: 'TD' },
      { name: 'Chile', code: 'CL' },
      { name: 'China', code: 'CN' },
      { name: 'Christmas Island', code: 'CX' },
      { name: 'Cocos (Keeling) Islands', code: 'CC' },
      { name: 'Colombia', code: 'CO' },
      { name: 'Comoros', code: 'KM' },
      { name: 'Congo', code: 'CG' },
      { name: 'Congo, The Democratic Republic of the', code: 'CD' },
      { name: 'Cook Islands', code: 'CK' },
      { name: 'Costa Rica', code: 'CR' },
      { name: 'Cote D\'Ivoire', code: 'CI' },
      { name: 'Croatia', code: 'HR' },
      { name: 'Cuba', code: 'CU' },
      { name: 'Cyprus', code: 'CY' },
      { name: 'Czech Republic', code: 'CZ' },
      { name: 'Denmark', code: 'DK' },
      { name: 'Djibouti', code: 'DJ' },
      { name: 'Dominica', code: 'DM' },
      { name: 'Dominican Republic', code: 'DO' },
      { name: 'Ecuador', code: 'EC' },
      { name: 'Egypt', code: 'EG' },
      { name: 'El Salvador', code: 'SV' },
      { name: 'Equatorial Guinea', code: 'GQ' },
      { name: 'Eritrea', code: 'ER' },
      { name: 'Estonia', code: 'EE' },
      { name: 'Ethiopia', code: 'ET' },
      { name: 'Falkland Islands (Malvinas)', code: 'FK' },
      { name: 'Faroe Islands', code: 'FO' },
      { name: 'Fiji', code: 'FJ' },
      { name: 'Finland', code: 'FI' },
      { name: 'France', code: 'FR' },
      { name: 'French Guiana', code: 'GF' },
      { name: 'French Polynesia', code: 'PF' },
      { name: 'French Southern Territories', code: 'TF' },
      { name: 'Gabon', code: 'GA' },
      { name: 'Gambia', code: 'GM' },
      { name: 'Georgia', code: 'GE' },
      { name: 'Germany', code: 'DE' },
      { name: 'Ghana', code: 'GH' },
      { name: 'Gibraltar', code: 'GI' },
      { name: 'Greece', code: 'GR' },
      { name: 'Greenland', code: 'GL' },
      { name: 'Grenada', code: 'GD' },
      { name: 'Guadeloupe', code: 'GP' },
      { name: 'Guam', code: 'GU' },
      { name: 'Guatemala', code: 'GT' },
      { name: 'Guernsey', code: 'GG' },
      { name: 'Guinea', code: 'GN' },
      { name: 'Guinea-Bissau', code: 'GW' },
      { name: 'Guyana', code: 'GY' },
      { name: 'Haiti', code: 'HT' },
      { name: 'Heard Island and Mcdonald Islands', code: 'HM' },
      { name: 'Holy See (Vatican City State)', code: 'VA' },
      { name: 'Honduras', code: 'HN' },
      { name: 'Hong Kong', code: 'HK' },
      { name: 'Hungary', code: 'HU' },
      { name: 'Iceland', code: 'IS' },
      { name: 'India', code: 'IN' },
      { name: 'Indonesia', code: 'ID' },
      { name: 'Iran, Islamic Republic Of', code: 'IR' },
      { name: 'Iraq', code: 'IQ' },
      { name: 'Ireland', code: 'IE' },
      { name: 'Isle of Man', code: 'IM' },
      { name: 'Israel', code: 'IL' },
      { name: 'Italy', code: 'IT' },
      { name: 'Jamaica', code: 'JM' },
      { name: 'Japan', code: 'JP' },
      { name: 'Jersey', code: 'JE' },
      { name: 'Jordan', code: 'JO' },
      { name: 'Kazakhstan', code: 'KZ' },
      { name: 'Kenya', code: 'KE' },
      { name: 'Kiribati', code: 'KI' },
      { name: 'Korea, Democratic People\'S Republic of', code: 'KP' },
      { name: 'Korea, Republic of', code: 'KR' },
      { name: 'Kuwait', code: 'KW' },
      { name: 'Kyrgyzstan', code: 'KG' },
      { name: 'Lao People\'S Democratic Republic', code: 'LA' },
      { name: 'Latvia', code: 'LV' },
      { name: 'Lebanon', code: 'LB' },
      { name: 'Lesotho', code: 'LS' },
      { name: 'Liberia', code: 'LR' },
      { name: 'Libyan Arab Jamahiriya', code: 'LY' },
      { name: 'Liechtenstein', code: 'LI' },
      { name: 'Lithuania', code: 'LT' },
      { name: 'Luxembourg', code: 'LU' },
      { name: 'Macao', code: 'MO' },
      { name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK' },
      { name: 'Madagascar', code: 'MG' },
      { name: 'Malawi', code: 'MW' },
      { name: 'Malaysia', code: 'MY' },
      { name: 'Maldives', code: 'MV' },
      { name: 'Mali', code: 'ML' },
      { name: 'Malta', code: 'MT' },
      { name: 'Marshall Islands', code: 'MH' },
      { name: 'Martinique', code: 'MQ' },
      { name: 'Mauritania', code: 'MR' },
      { name: 'Mauritius', code: 'MU' },
      { name: 'Mayotte', code: 'YT' },
      { name: 'Mexico', code: 'MX' },
      { name: 'Micronesia, Federated States of', code: 'FM' },
      { name: 'Moldova, Republic of', code: 'MD' },
      { name: 'Monaco', code: 'MC' },
      { name: 'Mongolia', code: 'MN' },
      { name: 'Montserrat', code: 'MS' },
      { name: 'Morocco', code: 'MA' },
      { name: 'Mozambique', code: 'MZ' },
      { name: 'Myanmar', code: 'MM' },
      { name: 'Namibia', code: 'NA' },
      { name: 'Nauru', code: 'NR' },
      { name: 'Nepal', code: 'NP' },
      { name: 'Netherlands', code: 'NL' },
      { name: 'Netherlands Antilles', code: 'AN' },
      { name: 'New Caledonia', code: 'NC' },
      { name: 'New Zealand', code: 'NZ' },
      { name: 'Nicaragua', code: 'NI' },
      { name: 'Niger', code: 'NE' },
      { name: 'Nigeria', code: 'NG' },
      { name: 'Niue', code: 'NU' },
      { name: 'Norfolk Island', code: 'NF' },
      { name: 'Northern Mariana Islands', code: 'MP' },
      { name: 'Norway', code: 'NO' },
      { name: 'Oman', code: 'OM' },
      { name: 'Pakistan', code: 'PK' },
      { name: 'Palau', code: 'PW' },
      { name: 'Palestinian Territory, Occupied', code: 'PS' },
      { name: 'Panama', code: 'PA' },
      { name: 'Papua New Guinea', code: 'PG' },
      { name: 'Paraguay', code: 'PY' },
      { name: 'Peru', code: 'PE' },
      { name: 'Philippines', code: 'PH' },
      { name: 'Pitcairn', code: 'PN' },
      { name: 'Poland', code: 'PL' },
      { name: 'Portugal', code: 'PT' },
      { name: 'Puerto Rico', code: 'PR' },
      { name: 'Qatar', code: 'QA' },
      { name: 'Reunion', code: 'RE' },
      { name: 'Romania', code: 'RO' },
      { name: 'Russian Federation', code: 'RU' },
      { name: 'RWANDA', code: 'RW' },
      { name: 'Saint Helena', code: 'SH' },
      { name: 'Saint Kitts and Nevis', code: 'KN' },
      { name: 'Saint Lucia', code: 'LC' },
      { name: 'Saint Pierre and Miquelon', code: 'PM' },
      { name: 'Saint Vincent and the Grenadines', code: 'VC' },
      { name: 'Samoa', code: 'WS' },
      { name: 'San Marino', code: 'SM' },
      { name: 'Sao Tome and Principe', code: 'ST' },
      { name: 'Saudi Arabia', code: 'SA' },
      { name: 'Senegal', code: 'SN' },
      { name: 'Serbia and Montenegro', code: 'CS' },
      { name: 'Seychelles', code: 'SC' },
      { name: 'Sierra Leone', code: 'SL' },
      { name: 'Singapore', code: 'SG' },
      { name: 'Slovakia', code: 'SK' },
      { name: 'Slovenia', code: 'SI' },
      { name: 'Solomon Islands', code: 'SB' },
      { name: 'Somalia', code: 'SO' },
      { name: 'South Africa', code: 'ZA' },
      { name: 'South Georgia and the South Sandwich Islands', code: 'GS' },
      { name: 'Spain', code: 'ES' },
      { name: 'Sri Lanka', code: 'LK' },
      { name: 'Sudan', code: 'SD' },
      { name: 'Suriname', code: 'SR' },
      { name: 'Svalbard and Jan Mayen', code: 'SJ' },
      { name: 'Swaziland', code: 'SZ' },
      { name: 'Sweden', code: 'SE' },
      { name: 'Switzerland', code: 'CH' },
      { name: 'Syrian Arab Republic', code: 'SY' },
      { name: 'Taiwan, Province of China', code: 'TW' },
      { name: 'Tajikistan', code: 'TJ' },
      { name: 'Tanzania, United Republic of', code: 'TZ' },
      { name: 'Thailand', code: 'TH' },
      { name: 'Timor-Leste', code: 'TL' },
      { name: 'Togo', code: 'TG' },
      { name: 'Tokelau', code: 'TK' },
      { name: 'Tonga', code: 'TO' },
      { name: 'Trinidad and Tobago', code: 'TT' },
      { name: 'Tunisia', code: 'TN' },
      { name: 'Turkey', code: 'TR' },
      { name: 'Turkmenistan', code: 'TM' },
      { name: 'Turks and Caicos Islands', code: 'TC' },
      { name: 'Tuvalu', code: 'TV' },
      { name: 'Uganda', code: 'UG' },
      { name: 'Ukraine', code: 'UA' },
      { name: 'United Arab Emirates', code: 'AE' },
      { name: 'United Kingdom', code: 'GB' },
      { name: 'United States', code: 'US' },
      { name: 'United States Minor Outlying Islands', code: 'UM' },
      { name: 'Uruguay', code: 'UY' },
      { name: 'Uzbekistan', code: 'UZ' },
      { name: 'Vanuatu', code: 'VU' },
      { name: 'Venezuela', code: 'VE' },
      { name: 'Viet Nam', code: 'VN' },
      { name: 'Virgin Islands, British', code: 'VG' },
      { name: 'Virgin Islands, U.S.', code: 'VI' },
      { name: 'Wallis and Futuna', code: 'WF' },
      { name: 'Western Sahara', code: 'EH' },
      { name: 'Yemen', code: 'YE' },
      { name: 'Zambia', code: 'ZM' },
      { name: 'Zimbabwe', code: 'ZW' }
        ];
		$scope.country = 'United States';
		$scope.jobTitle = '';

    $http({method: 'GET', url: '/api/account'}).success(function (account, status) {
      $http({method: 'GET', url: '/api/account/'+account[0].id+'/subscriptions'}).success(function (subscription, status) {
        if( subscription == '' ) {
          $scope.accountType = 'FREE';
        } else {
          subscriptionId = subscription[0].serviceId;
          if( subscriptionId == 'PremiumWorkspace' || subscriptionId == 'TrackedFactory') {
            $scope.accountType = 'PREMIUM';
          } else {
            $scope.accountType = 'FREE';
          }
        }
      });
   });

		Profile.query().then(function (resp) {
		
			dataPreferences = resp.preferences;
			
			resp.attributes.forEach(function(as){
				if(as.name=='firstName')
				{
					$scope.firstName = as.value;
					firstNameValue = as.value;
					firstNameDescription = as.description;
				}
				if(as.name=='lastName')
				{
					$scope.lastName = as.value;
					lastNameValue = as.value;
					lastNameDescription = as.description;
				}
				if(as.name=='email')
				{
					$scope.email = as.value;
					emailValue = as.value;
					emailDescription = as.description;
				}
				if(as.name=='phone')
				{
					$scope.phone = as.value;
					phoneValue = as.value;
					phoneDescription = as.description;
				}
				if(as.name=='country')
				{
					$scope.country = as.value;
					countryValue = as.value;
					countryDescription = as.description;
				}
				if(as.name=='employer')
				{
					$scope.companyName = as.value;
					companyNameValue = as.value;
					companyNameDescription = as.description;
				}
				if(as.name=='departmentname')
				{
					$scope.departmentName = as.value;
					departmentNameValue = as.value;
					departmentNameDescription = as.description;
				}
				if(as.name=='jobtitle')
				{
					$scope.jobTitle = as.value;
					jobTitleValue = as.value;
					jobTitleDescription = as.description;
				}
				if(as.name=='sales_can_contact')
				{
					if(as.value=="true") {
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
			
			$.each(resp.preferences, function (key, skill) {
				if(/skill_/i.test(key))
				{
					$scope.userSkills.push({'key':key, 'name': skill});
				}
			});
			
			$.each(resp.preferences, function (key, dat) {
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
			
			$.each(resp.preferences, function (key, dat) {
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
			
			
				$scope.salesContactOptions = salesContactArray;
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
				}
				else {
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
        addSkill.query( skillset );
        $scope.userSkills.push({'key': next_key, 'name': $scope.addSkillModel});
        $scope.addSkillModel = "";
        $('#skill-name').focus();
	    }
		};
		
		$scope.removeSkill = function (skill) {
      $scope.userSkills = _.without($scope.userSkills, _.findWhere($scope.userSkills,  skill));
			removeSkills.update(skill.key);
		};
		
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
