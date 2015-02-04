/*jslint
 browser: true,
 devel:true ,
 node:true,
 nomen: true,
 es5:true
 */

/**
 * @author Oleksii Orel
 * @date 14/1/2015
 * service
 */

/*global angular*/

'use strict';

angular.module('odeskApp')
    .factory('RunnerService', ['$http', '$q', function ($http, $q) {
        return {
            getProcesses: function (workspaceId, projectPath, showLoading) {
                var deferred = $q.defer();
                var con = {
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    ignoreLoadingBar: !showLoading
                };
                $http.get('/api/runner/' + workspaceId + "/processes?project=" + projectPath, con)
                    .success(function (data) {
                        deferred.resolve(data); //resolve data
                    })
                    .error(function (err) { deferred.reject(err); });
                return deferred.promise;
            },

            getRunStatus:  function (workspaceId, processId, showLoading) {
                var deferred = $q.defer();
                var con = {
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    ignoreLoadingBar: !showLoading
                };
                $http.get('/api/runner/' + workspaceId + "/status/" + processId, con)
                    .success(function (data) {
                        deferred.resolve(data); //resolve data
                    })
                    .error(function (err) { deferred.reject(err); });
                return deferred.promise;
            },

            getResources:  function (workspaceId, showLoading) {
                var deferred = $q.defer();
                var con = {
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    ignoreLoadingBar: !showLoading
                };
                $http.get('/api/runner/' + workspaceId + "/resources", con)
                    .success(function (data) {
                        deferred.resolve(data); //resolve data
                    })
                    .error(function (err) { deferred.reject(err); });
                return deferred.promise;
            },

            runProcess: function (project, showLoading) {
                var deferred = $q.defer();
                var con = {
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    ignoreLoadingBar: !showLoading
                };
                $http.post('/api/runner/'+project.workspaceId+'/run?project='+ project.path, con)
                    .success(function (currentRunner) {
                            if(currentRunner.status == 'NEW' || currentRunner.status == 'RUNNING'){
                                project.runnerProcesses = [currentRunner];
                                project.status = currentRunner.status;
                            }
                        deferred.resolve(currentRunner);
                    })
                    .error(function (err) {
                        deferred.reject(err);
                    });
                return deferred.promise;
            },

            restartProcess: function (runnerProcess) {
                var deferred = $q.defer();
                var con = {
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                };
                var shutdownUrl = $.map(runnerProcess.links, function (obj) {
                    if (obj.rel == "stop") return obj.href
                })[0];
                var runUrl ='/api/runner/'+runnerProcess.workspace+'/run?project='+runnerProcess.project;

                if (typeof shutdownUrl == "undefined") {
                    shutdownUrl = '/api/runner/'+runnerProcess.workspace+'/stop/'+ runnerProcess.processId;
                }
                $http.post(shutdownUrl, con)
                    .success(function (data) {
                        $http.post(runUrl, con)
                            .success(function (data) {
                                deferred.resolve(data); //resolve data
                            })
                            .error(function (err) {
                                deferred.reject(err);
                            });
                    })
                    .error(function (err) {
                        deferred.reject(err);
                    });
                return deferred.promise;
            },

            stopProcess: function (runnerProcess, showLoading){
                var deferred = $q.defer();
                var con = {
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    ignoreLoadingBar: !showLoading
                };
                var shutdownUrl = $.map(runnerProcess.links, function (obj) {
                    if (obj.rel == "stop") return obj.href
                })[0];

                if (typeof shutdownUrl == "undefined") {
                    shutdownUrl = '/api/runner/'+runnerProcess.workspace+'/stop/'+ runnerProcess.processId;
                }
                $http.post(shutdownUrl, con)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (err) {
                        deferred.reject(err);
                    });
                return deferred.promise;
            }

        };
    }]);
