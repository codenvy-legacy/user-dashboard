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
    .factory('Workspace', ['$resource', '$q', '$http', function ($resource, $q, $http) {
        var item = $resource('/api/workspace/:workspaceID', {}, {
            all: { method: 'GET', params: { workspaceID: 'all' }, isArray: true },
            query: { method: 'GET', params: {}, isArray: false }
        });

        item.getMembersForWorkspace = function (workspaceId) {
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
                .error(function (err) { deferred.reject(); });
            return deferred.promise;
        };

        item.addMemberToWorkspace = function (workspaceId, userId) {
            var deferred = $q.defer();
            var con = {
                headers: {
                    'Content-Type': 'application/json',
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

        };
        return item;
    }]);


angular.module('odeskApp')
	.factory('Profile', function ($http, $q) {
	    return {
	        query: function () {
	            var deferred = $q.defer();
	            var con = {
	                headers: {
	                    'Accept': 'application/json',
	                    'X-Requested-With': 'XMLHttpRequest'
	                }
	            };
	            $http.get('/api/profile', con)
                    .success(function (data) {
                        deferred.resolve(data); //resolve data
                    })
                    .error(function (err) { deferred.reject(); });
	            return deferred.promise;
	        },

	        getById: function (userId) {
	            var deferred = $q.defer();
	            var con = {
	                headers: {
	                    'Accept': 'application/json',
	                    'X-Requested-With': 'XMLHttpRequest'
	                }
	            };
	            $http.get('/api/profile/' + userId, con)
                    .success(function (data) {
                        deferred.resolve(data); //resolve data
                    })
                    .error(function (err) { deferred.reject(); });
	            return deferred.promise;
	        },

	        update: function (appValue) {
	            var deferred = $q.defer();
	            var con = {
	                headers: {
	                    'Content-Type': 'application/json; charset=UTF-8',
	                    'X-Requested-With': 'XMLHttpRequest'
	                }
	            };

	            $http.post('/api/profile', appValue, con)
                   .success(function (data) {
                       $('#btn-preloader1').removeClass('preloader');
                       $('#btn1').removeClass('btn-disabled');
                       $('#upadateProfileAlert .alert-success').show();
                       $('#upadateProfileAlert .alert-danger').hide();
                       $('#upadateProfileAlert .alert').mouseout(function () { $(this).fadeOut('slow'); });
                       deferred.resolve(data); //resolve data
                   })
                   .error(function (err) {
                       $('#btn-preloader1').removeClass('preloader');
                       $('#btn1').removeClass('btn-disabled');
                       $('#upadateProfileAlert .alert-danger').show();
                       $('#upadateProfileAlert .alert-success').hide();
                       $('#upadateProfileAlert .alert').mouseout(function () { $(this).fadeOut('slow'); });
                       deferred.reject();
                   });
	            return deferred.promise;
	        }
	    };
	});

angular.module('odeskApp')
	.factory('Users', function ($http, $q) {
	    return {
	        query: function () {
	            var deferred = $q.defer();
	            var con = {
	                headers: {
	                    'Accept': 'application/json',
	                    'X-Requested-With': 'XMLHttpRequest'
	                }
	            };
	            $http.get('/api/account', con)
                    .success(function (data) {
                        deferred.resolve(data); //resolve data
                    })
                    .error(function (err) { deferred.reject(); });
	            return deferred.promise;
	        },

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
	.factory('Account', function ($http, $q) {
	    return {
	        query: function (orgId) {
	            var deferred = $q.defer();
	            var con = {
	                headers: {
	                    'Accept': 'application/json',
	                    'X-Requested-With': 'XMLHttpRequest'
	                }
	            };
	            $http.get('/api/account/' + orgId + '/subscriptions', con)
                    .success(function (data) {
                        deferred.resolve(data); //resolve data
                    })
                    .error(function (err) { deferred.reject(); });
	            return deferred.promise;
	        }
	    };
	});

angular.module('odeskApp')
	.factory('addSkill', function ($http, $q) {
	    return {
	        query: function (skillset) {
	            var config = {
	                method: 'POST',
	                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
	                url: '/api/profile/prefs',
	                data: skillset
	            };
	            $http(config).success(function (data) {
	                $('#btn-preloader3').removeClass('preloader');
	                $('#btn3').removeClass('btn-disabled');
	                $('#addSkillsAlert .alert-success').show();
	                $('#addSkillsAlert .alert-danger').hide();
	            }).error(function (err) {
	                $('#btn-preloader3').removeClass('preloader');
	                $('#btn3').removeClass('btn-disabled');
	                $('#addSkillsAlert .alert-danger').show();
	                $('#addSkillsAlert .alert-success').hide();
	            });
	            setTimeout(function () { $('#addSkillsAlert .alert').fadeOut('slow'); }, 3000);
	        }
	    };
	});

angular.module('odeskApp').factory('removeSkills', function ($http) {
    return {
        update: function (skill) {
            var config = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                url: '/api/profile/prefs',
                data: new Array(skill)
            };
            $http(config).success(function (data) {
                $('#removeSkillsAlert .alert-success').show();
                $('#removeSkillsAlert .alert-danger').hide();
                setTimeout(function () { $('#removeSkillsAlert .alert').fadeOut('slow'); }, 3000);
            }).error(function (err) {
                $('#removeSkillsAlert .alert-danger').show();
                $('#removeSkillsAlert .alert-success').hide();
                setTimeout(function () { $('#removeSkillsAlert .alert').fadeOut('slow'); }, 3000);
            });
        }
    };
});


angular.module('odeskApp')
	.factory('addUsage', function ($http, $q) {
	    return {
	        update: function (appValue) {
	            var deferred = $q.defer();
	            var con = {
	                headers: {
	                    'Content-Type': 'application/json; charset=UTF-8',
	                    'X-Requested-With': 'XMLHttpRequest'
	                }
	            };

	            $http.post('/api/profile/prefs', appValue, con)
                   .success(function (data) {
                       $('#btn-preloader4').removeClass('preloader');
                       $('#btn4').removeClass('btn-disabled');
                       $('#usageAlert .alert-success').show();
                       $('#usageAlert .alert-danger').hide();
                       $('#usageAlert .alert').mouseout(function () { $(this).fadeOut('slow'); });
                       deferred.resolve(data); //resolve data
                   })
                   .error(function (err) {
                       $('#btn-preloader4').removeClass('preloader');
                       $('#btn4').removeClass('btn-disabled');
                       $('#usageAlert .alert-danger').show();
                       $('#usageAlert .alert-success').hide();
                       $('#usageAlert .alert').mouseout(function () { $(this).fadeOut('slow'); });
                       deferred.reject();
                   });
	            return deferred.promise;
	        }
	    };
	});

angular.module('odeskApp')
    .factory('Project', ['$resource', '$http', '$q', function ($resource, $http, $q) {
        var item = $resource('/api/project/:workspaceID', {}, {
            create: { method: 'POST', params: {}, isArray: false },
            query: { method: 'GET', params: {}, isArray: true },
            put: { method: 'PUT', params: { workspaceID: 'workspaceimb0rqn76p2euvn4' }, isArray: false }
        });

        item.getPermissions = function (workspaceId, projectName) { // custom function added to the resource object
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
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            };

            $http.post('/api/project/' + workspaceId + "/permissions/" + projectName,
                data,
                con
                //{
                //    headers: {
                //        'Accept': '*/*',
                //        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                //        'X-Requested-With': 'XMLHttpRequest'
                //    }
                //}
                )
                .success(function (data) {
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) { deferred.reject(); });


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
                        deferred.reject();
                        $('#changePasswordAlert .alert').mouseout(function () { $(this).fadeOut('slow'); });
                    });
	            return deferred.promise;
	        }
	    };
	});
