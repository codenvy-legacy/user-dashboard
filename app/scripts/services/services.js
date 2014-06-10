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
    .factory('Workspace',  ['$resource', function ($resource) {
        return $resource('/api/workspace/:workspaceID', {}, {
            all: {method: 'GET', params: {workspaceID: 'all'}, isArray: true},
            query: {method: 'GET', params: {}, isArray: false}
        });
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
					$('#upadateProfileAlert .alert-success').show();
					$('#upadateProfileAlert .alert-danger').hide();
					$('#upadateProfileAlert .alert').mouseout(function(){ $(this).fadeOut('slow'); });
                    deferred.resolve(data); //resolve data
               })
                .error(function (err) {
					$('#upadateProfileAlert .alert-danger').show();
					$('#upadateProfileAlert .alert-success').hide();
					$('#upadateProfileAlert .alert').mouseout(function(){ $(this).fadeOut('slow'); });
					deferred.reject();
				});
            return deferred.promise; 
        }
    };
});

angular.module('odeskApp')	
	.factory('addSkill', function ($http, $q) {
    return {
        query: function (appValue) {
            var deferred = $q.defer();
			var con = {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
					'X-Requested-With': 'XMLHttpRequest'
                }
            };
			
             $http.post('/api/profile/prefs', appValue, con)
                .success(function (data) {
					$('#addSkillsAlert .alert-success').show();
					$('#addSkillsAlert .alert-danger').hide();
					$('#addSkillsAlert .alert').mouseout(function(){ $(this).fadeOut('slow'); });
                    deferred.resolve(data); //resolve data
               })
                .error(function (err) {
					$('#addSkillsAlert .alert-danger').show();
					$('#addSkillsAlert .alert-success').hide();
					$('#addSkillsAlert .alert').mouseout(function(){ $(this).fadeOut('slow'); });
					deferred.reject();
				});
            return deferred.promise; 
        }
    };
});

angular.module('odeskApp')	
	.factory('removeSkills', function ($http, $q) {
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
					$('#removeSkillsAlert .alert-success').show();
					$('#removeSkillsAlert .alert-danger').hide();
					$('#removeSkillsAlert .alert').mouseout(function(){ $(this).fadeOut('slow'); });
                    deferred.resolve(data); //resolve data
               })
                .error(function (err) {
					$('#removeSkillsAlert .alert-danger').show();
					$('#removeSkillsAlert .alert-success').hide();
					$('#removeSkillsAlert .alert').mouseout(function(){ $(this).fadeOut('slow'); });
					deferred.reject();
				});
            return deferred.promise; 
        }
    };
});

angular.module('odeskApp')
    .factory('Project',  ['$resource', function ($resource) {
        return $resource('/api/project/:workspaceID', {}, {
            create: {method: 'POST', params: {}, isArray: false},
            query: {method: 'GET', params: {}, isArray: true},
            put: {method: 'PUT', params: {workspaceID: 'workspaceimb0rqn76p2euvn4'}, isArray: false}
        });
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
					transformRequest: function(data) { // If this is not an object, defer to native stringification.
						 
						if ( ! angular.isObject( data ) ) {
	
							return( ( data == null ) ? "" : data.toString() );
 
						}
	
						var buffer = [];
	
						// Serialize each key in the object.
						for ( var name in data ) {
 
							if ( ! data.hasOwnProperty( name ) ) {
 
								continue;
 
							}
 
							var value = data[ name ];
 
							buffer.push(
								encodeURIComponent( name ) +
								"=" +
								encodeURIComponent( ( value == null ) ? "" : value )
							);
		
						}
 
						// Serialize the buffer and clean it up for transportation.
						var source = buffer
							.join( "&" )
							.replace( /%20/g, "+" )
						;
 
						return( source ); }
			})
                .success(function (data) {
                    $('#changePasswordAlert .alert-success').show();
					$('#changePasswordAlert .alert-danger').hide();
					$('#changePasswordAlert .alert').mouseout(function(){ $(this).fadeOut('slow'); });
                    deferred.resolve(data); //resolve data
               })
                .error(function (err) { 
					$('#changePasswordAlert .alert-danger').show();
					$('#changePasswordAlert .alert-success').hide();
					deferred.reject();
					$('#changePasswordAlert .alert').mouseout(function(){ $(this).fadeOut('slow'); });
				});
            return deferred.promise; 
        }
    };
});        
