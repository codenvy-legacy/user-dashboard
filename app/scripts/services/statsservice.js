/*jslint
    browser: true,
    devel:true ,
    node:true,
    nomen: true,
    es5:true
*/

/**
 * @auth
 * @date
 * service 
 */

/*global angular*/
'use strict';

	angular.module('odeskApp')
    .factory('Stats', ['$resource', '$http', '$q', function ($resource, $http, $q) {
        
		var  stats = {};
		
		stats.getSessionsData = function (reqdata) {
            var deferred = $q.defer();
            
            var con = {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
				cache:true
            };
            
            $http.post('/api/analytics/metric/product_usage_sessions/list',reqdata,con)
                .success(function (response) {
                    deferred.resolve(response); //resolve data
                })
                .error(function (err) { 
                    deferred.reject(); 
                });
              
            return deferred.promise;
        };
		
		stats.getCumulativeMinutesData = function (reqdata) {
            var deferred = $q.defer();
            
            var con = {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
				cache:true
            };
            
            $http.post('/api/analytics/metric/product_usage_time_total/list',reqdata,con)
                .success(function (response) {
                    deferred.resolve(response); //resolve data
                })
                .error(function (err) { 
                    deferred.reject(); 
                });
              
            return deferred.promise;
        };
		
		stats.getBuildsData = function (reqdata) {
            var deferred = $q.defer();
            
            var con = {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
				cache:true
            };
            
            $http.post('/api/analytics/metric/builds/list',reqdata,con)
                .success(function (response) {
                    deferred.resolve(response); //resolve data
                })
                .error(function (err) { 
                    deferred.reject(); 
                });
              
            return deferred.promise;
        };
		
		stats.getRunsData = function (reqdata) {
            var deferred = $q.defer();
            
            var con = {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
				cache:true
            };
            
            $http.post('/api/analytics/metric/runs/list',reqdata,con)
                .success(function (response) {
                    deferred.resolve(response); //resolve data
                })
                .error(function (err) { 
                    deferred.reject(); 
                });
              
            return deferred.promise;
        };
		
		stats.getDebugsData = function (reqdata) {
            var deferred = $q.defer();
            
            var con = {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
				cache:true
            };
            
            $http.post('/api/analytics/metric/debugs/list',reqdata,con)
                .success(function (response) {
                    deferred.resolve(response); //resolve data
                })
                .error(function (err) { 
                    deferred.reject(); 
                });
              
            return deferred.promise;
        };
		
		stats.getDeploysData = function (reqdata) {
            var deferred = $q.defer();
            
            var con = {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
				cache:true
            };
            
            $http.post('/api/analytics/metric/deploys/list',reqdata,con)
                .success(function (response) {
                    deferred.resolve(response); //resolve data
                })
                .error(function (err) { 
                    deferred.reject(); 
                });
              
            return deferred.promise;
        };
		
		stats.getCreatedFactoriesData = function (reqdata) {
            var deferred = $q.defer();
            
            var con = {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
				cache:true
            };
            
            $http.post('/api/analytics/metric/created_factories/list',reqdata,con)
                .success(function (response) {
                    deferred.resolve(response); //resolve data
                })
                .error(function (err) { 
                    deferred.reject(); 
                });
              
            return deferred.promise;
        };
		
		stats.getCollaborativeSessionsData = function (reqdata) {
            var deferred = $q.defer();
            
            var con = {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
				cache:true
            };
            
            $http.post('/api/analytics/metric/collaborative_sessions_started/list',reqdata,con)
                .success(function (response) {
                    deferred.resolve(response); //resolve data
                })
                .error(function (err) { 
                    deferred.reject(); 
                });
              
            return deferred.promise;
        };
		
	    stats.getTimeInBuildQueue = function(fromDate,toDate) {
		    var deferred = $q.defer();
            var con = {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
				params:{ from_date:fromDate,to_date:toDate},
				cache: true
            };
            $http.get('/api/analytics/metric/time_in_build_queue',con)
                .success(function (data) {
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) { deferred.reject(); });
            return deferred.promise;
		}
		
		
		stats.getBuildsTime = function(fromDate,toDate) {
		    var deferred = $q.defer();
            var con = {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
				params:{ from_date:fromDate,to_date:toDate},
				cache: true
            };
            $http.get('/api/analytics/metric/builds_time',con)
                .success(function (data) {
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) { deferred.reject(); });
            return deferred.promise;
		}
		

       stats.getBuildQueueTerminations = function(fromDate,toDate) {
	        var deferred = $q.defer();
            var con = {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
				params:{ from_date:fromDate,to_date:toDate},
				cache: true
            };
            $http.get('/api/analytics/metric/build_queue_terminations',con)
                .success(function (data) {
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) { deferred.reject(); });
            return deferred.promise;
		}

		stats.getTimeInRunQueue = function(fromDate,toDate) {
		    var deferred = $q.defer();
            var con = {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
				params:{ from_date:fromDate,to_date:toDate},
				cache: true
            };
            $http.get('/api/analytics/metric/time_in_run_queue',con)
                .success(function (data) {
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) { deferred.reject(); });
            return deferred.promise;
		}
		
		stats.getRunsTime = function(fromDate,toDate) {
		    var deferred = $q.defer();
            var con = {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
				params:{ from_date:fromDate,to_date:toDate},
				cache: true
            };
            $http.get('/api/analytics/metric/runs_time',con)
                .success(function (data) {
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) { deferred.reject(); });
            return deferred.promise;
		}

		stats.getRunQueueTerminations = function(fromDate,toDate) {
		    var deferred = $q.defer();
            var con = {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
				params:{ from_date:fromDate,to_date:toDate},
				cache: true
            };
            $http.get('/api/analytics/metric/run_queue_terminations',con)
                .success(function (data) {
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) { deferred.reject(); });
            return deferred.promise;
		}


		stats.getDockerConfigurationTime = function(fromDate,toDate) {
		    var deferred = $q.defer();
            var con = {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
				params:{ from_date:fromDate,to_date:toDate},
				cache: true
            };
            $http.get('/api/analytics/metric/docker_configuration_time',con)
                .success(function (data) {
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) { deferred.reject(); });
            return deferred.promise;
		}
			
        return stats;
    }]);