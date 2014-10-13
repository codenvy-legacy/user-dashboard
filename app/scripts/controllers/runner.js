/*jslint
 browser: true,
 devel:true ,
 node:true,
 nomen: true,
 es5:true
 */

/**
 * @auth Parth Chhaiya
 * @date 08/12/2014
 * Controller for runners
 */

'use strict';
angular.module('odeskApp')
    .controller('RunnerCtrl', function ($scope, Workspace, $http, $q, $cookies, $timeout) {
      $scope.runners = [];
      $scope.projects = [];
      $scope.ramConsumption = [];
      $scope.filter = {};
      $scope.workspaces = [];
      $scope.refreshStatus = $cookies['refreshStatus'];

      Workspace.all(function (resp) {
        $scope.workspaces = _.filter(resp, function (workspace) {return !workspace.workspaceReference.temporary;});

        angular.forEach($scope.workspaces, function (value) {
          // Get workspace related resources
          $http({method: 'GET', url:"/api/runner/"+ value.workspaceReference.id +"/resources" }).
            success(function (data) {

              var workspaceResources = {
                workspaceName: value.workspaceReference.name,
                usedMemory: data.usedMemory,
                totalMemory: data.totalMemory
              }
              $scope.ramConsumption.push(workspaceResources);
            });

          // Get list of runners
          $http({method: 'GET', url: $.map(value.workspaceReference.links,function(obj){if(obj.rel=="get projects") return obj.href})[0]}).
            success(function (data, status) {
              $scope.projects = $scope.projects.concat(data);
              angular.forEach($scope.projects, function (project) {
                $http({method: 'GET', url:"/api/runner/"+ value.workspaceReference.id +"/processes?project="+project.path }).
                  success(function (data) {
                    if(data.length > 0){
                      for (var i = data.length - 1; i >= 0; i--) {
                        var currentRunner = data[i];
                        if(currentRunner.status == "RUNNING"){
                          var runnerDetails = {
                            project: project,
                            startTime: currentRunner.startTime,
                            shutdownUrl: $.map(currentRunner.links,function(obj){if(obj.rel=="stop") return obj.href})[0],
                            url: $.map(currentRunner.links,function(obj){if(obj.rel=="web url") return obj.href})[0],
                            dockerRecipe: $.map(currentRunner.links,function(obj){if(obj.rel=="runner recipe") return obj.href})[0],
                            terminalUrl: $.map(currentRunner.links,function(obj){if(obj.rel=="shell url") return obj.href})[0]
                          }
                          $scope.runners.push(runnerDetails);
                        }
                      };
                    }
                  });
              });
            });

          $timeout(function () {
            $("[rel=tooltip]").tooltip({ placement: 'bottom' });
            $(document).on("click", ".searchfield", function () {
              $('.searchfull').show();
              $('.detail').animate({ opacity: 0 }, 400);
              $('.searchfull').animate({ width: "100%" }, 400, function () { $(".closeBtn").show(); });
              $('.searchfield').focus();
            });
            $(document).on("click", ".closeBtn", function () {
              $(".closeBtn").hide();
              $('.detail').animate({ opacity: 1 }, 400);
              $('.searchfull').animate({ width: "43px" }, 400, function () {
                $('.searchfield').val('');
                $('.searchfull').hide();
              });
            });
          });

        });
      });

      $scope.setDateFormat = function (startTime){
        var now = new Date();
        var startTimeInMs = new Date(startTime);

        var delta = now.getTime() - startTimeInMs.getTime();

        delta = delta/1000;

        var min, hour, sec, days;

        if(delta<=59){
          delta = Math.floor(delta)
          delta = delta <= 9 ? "0"+delta : delta
          return "00:00:"+delta;
        }

        if(delta>=60 && delta<=3599){
          min = Math.floor(delta/60);
          min = min <= 9 ? "0"+min : min
          sec = Math.floor(delta-(min*60));
          sec = sec <= 9 ? "0"+sec : sec
          return "00:"+min+":"+sec;
        }

        if(delta>=3600 && delta<=86399){
          hour= Math.floor(delta/3600);
          min = (delta-(hour*3600))/60;
          sec = Math.floor(delta-(min*60));

          hour = hour <= 9 ? "0"+hour : hour
          min = min <= 9 ? "0"+min : min
          sec = sec <= 9 ? "0"+sec : sec

          return hour+":"+Math.floor(min)+":"+sec;
        }

        if(delta>=86400){
          days =  Math.floor(delta/86400);
          hour =  Math.floor((delta-(days*86400))/3600);
          min  =  Math.floor((delta-(hour*3600))/60);
          sec  =  Math.floor(delta-(min*60));

          hour = hour <= 9 ? "0"+hour : hour
          min = min <= 9 ? "0"+min : min
          sec = sec <= 9 ? "0"+sec : sec

          return days+" days and "+hour+":"+min+":"+sec;
        }
      };

      $scope.shutdownRunnerRefresh = function (shutdownUrl){

        var deferred = $q.defer();

        $http({method: 'POST', url: shutdownUrl})
          .success(function (data) {
            deferred.resolve(data);
            $scope.refresh();
          })
          .error(function (err) { deferred.reject(); });
        return deferred.promise;
      };

      $scope.shutdownRunner = function (shutdownUrl){

        var deferred = $q.defer();

        $http({method: 'POST', url: shutdownUrl})
            .success(function (data) {
              deferred.resolve(data);
            })
            .error(function (err) { deferred.reject(); });
        return deferred.promise;
      };

      $scope.restartRunner = function (shutdownUrl, project){

        return $q.all([
          $scope.shutdownRunner(shutdownUrl)
        ]).then(function (results) {
          var deferred = $q.defer();

          $http({method: 'POST', url: '/api/runner/'+project.workspaceId+'/run?project='+project.path})
            .success(function (data) {
              deferred.resolve(data);
            })
            .error(function (err) { deferred.reject(); });
        });

      };

      $scope.refresh = function (){
        location.reload();
      };

      $scope.refreshStatusCheck = function () {
        if($cookies.refreshStatus == "DISABLED"){
          $cookies.refreshStatus = "ENABLED"
        }else{
          $cookies.refreshStatus = "DISABLED"
        }
        $scope.refresh();
      };

      if($cookies.refreshStatus == "ENABLED"){
        $timeout($scope.refresh, 30000);
      }

    });