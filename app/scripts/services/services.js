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
    .factory('Workspace', ['$resource', '$q', '$http', 'RunnerService', function ($resource, $q, $http, RunnerService) {
        var Workspace = {};

        Workspace.workspaces = [];
        Workspace.currentWorkspace = null;

        Workspace.all = function (showLoading) {
            var deferred = $q.defer();
            var con = {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                ignoreLoadingBar: !showLoading
            };
            $http.get('/api/workspace/all', con)
                .success(function (data) {
                    var workspaces = [];
                    if(data !== null){
                        workspaces = workspaces.concat(_.filter(data, function (workspace) {
                            return !workspace.workspaceReference.temporary;
                        }));
                        if(!angular.equals(Workspace.workspaces, workspaces)) {
                            Workspace.workspaces = workspaces;
                        }
                    }
                    deferred.resolve(workspaces); //resolve data
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        },

        Workspace.updateWorkspaceResources = function (showLoading) {
           var deferred = $q.defer();
           var workspaceCount = 0;
            Workspace.workspaces.forEach( function (workspace) {
                workspaceCount++;
                RunnerService.getResources(workspace.workspaceReference.id, showLoading).then(function (resources) {
                    workspace.usedMemory = resources.usedMemory;
                    workspace.totalMemory = resources.totalMemory;
                    if (workspaceCount == Workspace.workspaces.length) {
                        deferred.resolve(Workspace.workspaces); //resolve data
                    }
                }, function (err) {
                    workspaceCount++;
                    deferred.reject(err);
                });

             });
            return deferred.promise;
        },

        Workspace.getMembersForWorkspace = function (workspaceId) {
            var deferred = $q.defer();
            var con = {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            };
            $http.get('/api/workspace/' + workspaceId + "/members", con)
                .success(function (data) {
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) {
                    deferred.reject();
                });
            return deferred.promise;
        },

        Workspace.addMemberToWorkspace = function (workspaceId, userId) {
            var deferred = $q.defer();
            var con = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            var roles = [
                "workspace/developer"
            ];

            var data = {
                "userId": userId,
                "roles": roles // needs to be array
            };

            $http.post('/api/workspace/' + workspaceId + "/members",
                data,
                con)
                .success(function (data) {
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) { deferred.reject(); });
            return deferred.promise;

        },

        Workspace.removeMember = function (workspaceId, userId) {
            var deferred = $q.defer();
            $http.delete('/api/workspace/' + workspaceId + '/members/' + userId)
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (err) {
                    deferred.reject();
                });
            return deferred.promise;
        },

        Workspace.removeWorkspace = function (workspaceId) {
            var deferred = $q.defer();
            $http.delete('/api/workspace/' + workspaceId)
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        return Workspace;
    }]);

// Get countries
angular.module('odeskApp')
    .factory('Countries', function () {
        return {
            all: function () {
                return  [
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
            },
            default : function () {
                return 'United States';
            }
        };
    });

// Get workspace details based on workspace id
angular.module('odeskApp')
    .factory('WorkspaceInfo', function ($http, $q) {
      return {
        getDetail: function (workspaceId) {
          var deferred = $q.defer();
          var con = {
            headers: {
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            }
          };
          $http.get('/api/workspace/' + workspaceId, con)
            .success(function (data) {
              deferred.resolve(data); //resolve data
            })

          return deferred.promise;
        }
      };
    });

 // for hiding docBoxes
angular.module('odeskApp')
  .factory('DocBoxService',function ($cookieStore) {
    var docboxes = [{'id':'1','title':'Hello World!','content':'Learn how to start first Codenvy project,Versioning,Building and Running it.'},
      {'id':'2','title':'Getting Your Projects on Codenvy','content':'Start importing your existing projects on Codenvy from GitHub, BitBucket or other desktop environments and getting them building and running.'},
      {'id':'3','title':'Understanding Custom Build and Run Codenvy Environments','content':'Learn how to create a Custom Build and Run Codenvy Environments for your Project.'}, 
      {'id':'4','title':'Contribute to Eclipse Che','content':'Get more information about how to contribute to Eclipse Che- the Open Source version of Codenvy and create plugins,extensions and new tooling applications.'}
      ];
  
    
   
    return {
      getDocBoxes: function () {
        var isShownItems =[]; 
        var docboxItems=[];
        if($cookieStore.get('UD_user_docboxes')==undefined)
          {
           angular.forEach(docboxes,function(v,k){
              isShownItems.push({'id':v.id,'isShown':true});
              docboxItems.push(v);
            });           
            $cookieStore.put('UD_user_docboxes',isShownItems);
          }
          else{
            isShownItems = $cookieStore.get('UD_user_docboxes');
            angular.forEach(docboxes,function(v1,k1){
              if(v1.id==isShownItems[k1].id && isShownItems[k1].isShown==true)
                {
                 docboxItems.push(v1);
                }
            });
          }    
          return docboxItems;        
        }, 

      hideDocBox: function(item){
        if($cookieStore.get('UD_user_docboxes'))
          {   
            var temp = [];
            angular.forEach($cookieStore.get('UD_user_docboxes'),function(v,k){
              if(v.id==item.id){
                  v.isShown=false;
                }
              temp.push(v);              
            }); 
            $cookieStore.put('UD_user_docboxes',temp);
          }
        }
      };
    });

angular.module('odeskApp')
	.factory('Users', function ($http, $q) {
	    return {
	        getUserByEmail: function (email) {
	            var deferred = $q.defer();
	            var con = {
	                headers: {
	                    'Accept': 'application/json',
	                    'X-Requested-With': 'XMLHttpRequest'
	                }
	            };
	            $http.get('/api/user/find?email=' + email, con)
                    .success(function (data) {
                        deferred.resolve(data); //resolve data
                    })
                    .error(function (err) { deferred.reject(); });
	            return deferred.promise;
	        }
	    };
	});

angular.module('odeskApp')
    .factory('OrgAddon', function ($rootScope, AccountService, $q) {
        var orgAddonData = {};
        orgAddonData.isOrgAddOn = true;
        orgAddonData.accounts = [];

        orgAddonData.update = function(accounts) {
            orgAddonData.accounts = accounts;
            orgAddonData.currentAccount = accounts.length > 0 ? accounts[0] : null;
            $rootScope.$broadcast('orgAddonDataUpdated');
        };

        orgAddonData.updateCurrentAccount = function(account) {
            if (account != orgAddonData.currentAccount) {
                orgAddonData.currentAccount = account;
                $rootScope.$broadcast('orgAddonUpdateCurrentAccount');
            }
        };

        orgAddonData.getOrgAccounts = function () {
            var deferred = $q.defer();
            var accounts = [];

            AccountService.getAccounts().then(function () {
                angular.forEach(AccountService.accounts, function (membership) {
                    if (membership.roles.indexOf("account/owner") >= 0) {
                        accounts.push(membership.accountReference);
                    }
                });

                var promises = [];
                var orgAccounts = [];
                angular.forEach(accounts, function (account) {
                    promises.push(
                        AccountService.getSubscriptions(account.id).then(function () {
                            orgAccounts.push(account);
                        }));

                });
                $q.all(promises).then(function () {
                    orgAddonData.update(orgAccounts);
                    deferred.resolve();
                })
            });

            return deferred.promise;
        };


        return orgAddonData;
    });



angular.module('odeskApp')
    .factory('Project', ['$resource', '$http', '$q', function ($resource, $http, $q) {
        var item = $resource('/api/project/:workspaceID', {}, {
            create: { method: 'POST', params: {}, isArray: false },
            query: { method: 'GET', params: {}, isArray: true },
            put: { method: 'PUT', params: { workspaceID: 'workspaceimb0rqn76p2euvn4' }, isArray: false },
            import: { method: 'POST', url: '/api/project/:workspaceID/import/:path' }
        });

        item.rename = function (workspaceId, projectPath, projectName) {
            var deferred = $q.defer();
            var con = {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            };
            $http.post('/api/project/' + workspaceId + "/rename" + projectPath + "?name=" + projectName, con)
                .success(function (data) {
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) { deferred.reject(err); });
            return deferred.promise;
        };

        item.getProject = function (workspaceId, projectPath) {
            var deferred = $q.defer();
            var con = {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            };
            $http.get('/api/project/' + workspaceId + "/" + projectPath, con)
                .success(function (data) {
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) { deferred.reject(err); });
            return deferred.promise;
        };

        item.setProject = function (workspaceId, projectPath, data) {
            var deferred = $q.defer();
            var con = {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            };
            $http.put('/api/project/' + workspaceId + "/" + projectPath, data, con)
                .success(function (data) {
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) { deferred.reject(err); });
            return deferred.promise;
        };

        item.delete = function (project) {
            var deferred = $q.defer();
            var url = project.url ? project.url : project. baseUrl;
            $http.delete(url)
                .success(function () {
                    deferred.resolve();
                })
                .error(function (err) { deferred.reject(err); });
            return deferred.promise;
        };

        item.getPermissions = function (workspaceId, projectName) {
            var deferred = $q.defer();
            var con = {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            };
            $http.get('/api/project/' + workspaceId + "/permissions/" + projectName, con)
                .success(function (data) {
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) { deferred.reject(); });
            return deferred.promise;
        };
        
        item.setPermissions = function (workspaceId, projectName, data) {
            var deferred = $q.defer();
            
            var con = {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            };
            
            $http.post('/api/project/' + workspaceId + "/permissions/" + projectName,
                data,
                con)
                .success(function (response) {
                    deferred.resolve(response); //resolve data
                })
                .error(function (err) { 
                    deferred.reject(); 
                });
              
            return deferred.promise;
        };
        
        return item;
    }]);

angular.module('odeskApp')
	.factory('Password', function ($http, $q) {
	    return {
	        update: function (pwd) {
	            var deferred = $q.defer();
	            $http.post('/api/user/password',
                    {
                        'password': pwd
                    },
                    {
                        headers: {
                            'Accept': '*/*',
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        transformRequest: function (data) { // If this is not an object, defer to native stringification.

                            if (!angular.isObject(data)) {

                                return ((data == null) ? "" : data.toString());

                            }

                            var buffer = [];

                            // Serialize each key in the object.
                            for (var name in data) {

                                if (!data.hasOwnProperty(name)) {

                                    continue;

                                }

                                var value = data[name];

                                buffer.push(
                                    encodeURIComponent(name) +
                                    "=" +
                                    encodeURIComponent((value == null) ? "" : value)
                                );

                            }

                            // Serialize the buffer and clean it up for transportation.
                            var source = buffer
                                .join("&")
                                .replace(/%20/g, "+")
                            ;

                            return (source);
                        }
                    })
                    .success(function (data) {
                        $('#btn-preloader2').removeClass('preloader');
                        $('#btn2').removeClass('btn-disabled');
                        $('#changePasswordAlert .alert-success').show();
                        $('#changePasswordAlert .alert-danger').hide();
                        $('#changePasswordAlert .alert').mouseout(function () { $(this).fadeOut('slow'); });
                        deferred.resolve(data); //resolve data
                    })
                    .error(function (err) {
                        $('#btn-preloader2').removeClass('preloader');
                        $('#btn2').removeClass('btn-disabled');
                        $('#changePasswordAlert .alert-danger').show();
                        $('#changePasswordAlert .alert-success').hide();
			$('#changePasswordAlert .alert-danger').text(err.message);
                        deferred.reject();
                        $('#changePasswordAlert .alert').mouseout(function () { $(this).fadeOut('slow'); });
                    });
	            return deferred.promise;
	        }
	    };
	});
