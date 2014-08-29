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
		
	    stats.getTimeInBuildQueue = function(fromDate,toDate) {
		    var deferred = $q.defer();
            var con = {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            };
            $http.get('/api/analytics/metric/time_in_build_queue',{params:{ from_date:fromDate,to_date:toDate},cache: true})
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
                }
            };
            $http.get('/api/analytics/metric/builds_time',{params:{ from_date:fromDate,to_date:toDate},cache: true})
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
                }
            };
            $http.get('/api/analytics/metric/build_queue_terminations',{params:{ from_date:fromDate,to_date:toDate},cache: true})
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
                }
            };
            $http.get('/api/analytics/metric/time_in_run_queue',{params:{ from_date:fromDate,to_date:toDate},cache: true})
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
                }
            };
            $http.get('/api/analytics/metric/runs_time',{params:{ from_date:fromDate,to_date:toDate},cache: true})
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
                }
            };
            $http.get('/api/analytics/metric/run_queue_terminations',{params:{ from_date:fromDate,to_date:toDate},cache: true})
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
                }
            };
            $http.get('/api/analytics/metric/docker_configuration_time',{params:{ from_date:fromDate,to_date:toDate},cache: true})
                .success(function (data) {
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) { deferred.reject(); });
            return deferred.promise;
		}
			
        return stats;
    }]);