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
 * stats page controller
 */

/*global angular, Morris, $*/

'use strict';

angular.module('odeskApp')
    .controller('StatsCtrl', function ($scope, $http, Stats) {
        
		$scope.noOfDays = 30;
		$scope.isDays = true;
		$scope.noOfWeeks = 12;
		
		$scope.selectedPeriodText = 'Last 30 Days';
		$scope.periodTexts = ['Last 7 Days','Last 30 Days','Last 3 Months'];
		
		$scope.selectPeriod = function(text) {
		
			$scope.selectedPeriodText = text;
			
			if($scope.periodTexts[0] == text) {
				$scope.noOfDays = 7;
				$scope.isDays = true;
				
				timeSpanChanged();
			}
			if($scope.periodTexts[1] == text) {
				$scope.noOfDays = 30;
				$scope.isDays = true;
				
				timeSpanChanged();
			}
			if($scope.periodTexts[2] == text) {
				$scope.noOfDays = 84;
				$scope.noOfWeeks = 12;
				$scope.isDays = false;
				
				timeSpanChanged();
			}
		}
		
		var DayData = function(sd,sdstr,ed,edstr) {
			this.sdate=sd;
			this.sdatestr=sdstr;
			this.edate=ed;
			this.edatestr = edstr;
		};
		
		var getToday = function() {
			  var currentDate = new Date();
			  var day = currentDate.getDate();
			  var month = currentDate.getMonth() + 1;
			  var year = currentDate.getFullYear();
				
			  if(day<10) { day='0'+day; } 

			  if(month<10) { month='0'+month; } 

			  return year+month+day;
		};
		
		var getStartDate = function() {
			  var currentDate = new Date();
			  var tempDate = new Date();
			  var dateOffset = (86400000) * ($scope.noOfDays-1); // (24*60*60*1000) = 86400000 and -1 for to include today
			  tempDate.setTime(currentDate.getTime()-dateOffset);
			  return tempDate;
		};

		// Used to pass from date and to date in API 
		var getDateString = function(d) {
			var day = d.getDate();
			  var month = d.getMonth() + 1;
			  var year = d.getFullYear();
				
			  if(day<10) { day='0'+day; } 

			  if(month<10) { month='0'+month; } 

			  return year+month+day;
		};
		
		// Used to display date on x axis of chart
		var getDateStringDispay = function(d) {
			var day = d.getDate();
			  var month = d.getMonth() + 1;
			  var year = d.getFullYear();
				
			  if(day<10) { day='0'+day; } 

			  if(month<10) { month='0'+month; } 

			  return year + '-' + month + '-' + day;
		};
		
		$scope.statsData = [];
		$scope.fromDate = '';
		$scope.toDate = '';
		
		// Here is all parameters 
		$scope.totalSessions = 0;
		$scope.dailySessions = [];
		
		$scope.totalCumulativeMinutes = 0;
		$scope.dailyCumulativeMinutes = [];
		
		$scope.totalBuilds = 0;
		$scope.dailyBuilds = [];
		
		
		$scope.totalRuns = 0;
		$scope.dailyRuns = [];
		
		$scope.totalDebugs = 0;
		$scope.dailyDebugs = [];
		
		$scope.totalDeploys = 0;
		$scope.dailyDebugs = [];
		
		$scope.totalCreatedFactories = 0;
		$scope.dailyCreatedFactories = [];
		
		$scope.totalCollaborativeSessionStarted = 0;
		$scope.dailyCollaborativeSessionStarted = [];
		
		$scope.buildStatsTimeInQueue = 0;
		$scope.buildStatsBuildsTime = 0;
		$scope.buildStatsQueueTerminations = 0;
		
		$scope.runStatsTimeInQueue = 0;
		$scope.runStatsRunsTime = 0;
		$scope.runStatsQueueTerminations = 0;

		$scope.totalTimeDockerConfig = 0;
		
	var getCumulativeMinutesData = function() {
			$scope.totalCumulativeMinutes = 0;
			
			// Build request data
			var reqData=[];
			angular.forEach($scope.statsData, function(day,key) {
					reqData.push({"from_date":day.sdatestr, "to_date":day.edatestr});
				});
			
			// Make post request
			$http.post('/api/analytics/metric/product_usage_time_total/list',reqData,{cache: true}).success(function(data, status, headers, config) {
                    $scope.dailyCumulativeMinutes = [];
					angular.forEach(data.metrics, function(day,key) {
					    var iVal = parseInt(day.value);  // in milliseconds
						var minuteVal = iVal / (60000);
						$scope.dailyCumulativeMinutes.push(minuteVal); 
						$scope.totalCumulativeMinutes += minuteVal;
					});
				});
		};
	
    $scope.getCumulativeMinutesFor = function (index) {
			if(index >=0 && index <$scope.dailyCumulativeMinutes.length)
				return Math.round( $scope.dailyCumulativeMinutes[index]);
			return 0;
	}
	
	$scope.getTotalCumulativeMinutes = function () {
			return Math.round( $scope.totalCumulativeMinutes);
	}
	
	 var getSessionsData = function() {
			$scope.totalSessions = 0;
			
			// Build request data
			var reqData=[];
			angular.forEach($scope.statsData, function(day,key) {
					reqData.push({"from_date":day.sdatestr, "to_date":day.edatestr});
				});
			
			// Make post request
			$http.post('/api/analytics/metric/product_usage_sessions/list',reqData,{cache: true}).success(function(data, status, headers, config) {
                    $scope.dailySessions = [];
					var i=0;
					angular.forEach(data.metrics, function(day,key) {
					    var iVal = parseInt(day.value);
						$scope.dailySessions.push({x:getDateStringDispay($scope.statsData[i].sdate),y:i,z:iVal}); 
						$scope.totalSessions += iVal;
						i++;
					});
						
					// redraw chart
					graphSessions.setData($scope.dailySessions);
                });
		};
		
	var getBuildsData = function() {
			$scope.totalBuilds = 0;
			
			// Build request data
			var reqData=[];
			angular.forEach($scope.statsData, function(day,key) {
					reqData.push({"from_date":day.sdatestr, "to_date":day.edatestr});
				});
			
			// Make post request
			$http.post('/api/analytics/metric/builds/list',reqData,{cache: true}).success(function(data, status, headers, config) {
                    $scope.dailyBuilds = [];
					angular.forEach(data.metrics, function(day,key) {
					    var iVal = parseInt(day.value);
						$scope.dailyBuilds.push(iVal);
						$scope.totalBuilds += iVal;
					});
						
					// redraw charts
					if ($(".dynamicsparklineBuilds").length > 0) {
						$(".dynamicsparklineBuilds").sparkline($scope.dailyBuilds, { enableTagOptions: true, disableHiddenCheck: true});
					}
                });
		};
	
	var getOneTimeStats = function() {
		
			Stats.getTimeInBuildQueue($scope.fromDate,$scope.toDate).then(function(data) {
				$scope.buildStatsTimeInQueue = (data.value/60000).toFixed(2);
			  });
			
			Stats.getBuildsTime($scope.fromDate,$scope.toDate).then(function(data) {
				$scope.buildStatsBuildsTime = (data.value/60000).toFixed(2);
			  });
			  
			Stats.getBuildQueueTerminations($scope.fromDate,$scope.toDate).then(function(data) {
				$scope.buildStatsQueueTerminations = data.value;
			  });
			
			Stats.getTimeInRunQueue($scope.fromDate,$scope.toDate).then(function(data) {
				$scope.runStatsTimeInQueue = (data.value/60000).toFixed(2);
			  });
			  
			Stats.getRunsTime($scope.fromDate,$scope.toDate).then(function(data) {
				$scope.runStatsRunsTime = (data.value/60000).toFixed(2);
			  });
			  
			Stats.getRunQueueTerminations($scope.fromDate,$scope.toDate).then(function(data) {
				$scope.runStatsQueueTerminations = data.value;
			  });
			
			Stats.getDockerConfigurationTime($scope.fromDate,$scope.toDate).then(function(data) {
				$scope.totalTimeDockerConfig = data.value;
			  });
		}
		
		
	var getStatsData = function() {
			getSessionsData();
			getCumulativeMinutesData();
			getBuildsData();
			getOneTimeStats();
		}
		
		
	var timeSpanChanged = function() {
			var startDate = getStartDate();
			var endDate = new Date();
			
			// get from date and to date in string format
			$scope.fromDate = getDateString(startDate);
			$scope.toDate = getDateString(endDate);
			
			var steps_milliseconds = 86400000;
			if(!$scope.isDays)
				steps_milliseconds *= 7; // now stepping through weeks
				
			$scope.statsData = []; // clear the list
			for(var date = startDate; date<=endDate;date.setTime(date.getTime()+steps_milliseconds))
			{
				if($scope.isDays)
				{
					var strDate = getDateString(date);
					var datetemp = new Date(date.getTime());
					$scope.statsData.push(new DayData(datetemp,strDate,datetemp,strDate));
				}
				else
				{
					var datetemp1 = new Date(date.getTime());
					var strDate1 = getDateString(datetemp1);
					
					var datetemp2 = new Date(date.getTime() + (86400000*6) ); 
					var strDate2 = getDateString(datetemp2);
					
					$scope.statsData.push(new DayData(datetemp1,strDate1,datetemp2,strDate2));
				}
			}
			
			getStatsData();
		}
		
		setTimeout(timeSpanChanged(),60);
		        
        var Data = [{x:'2014-08-01',y:0,z:0} ];
		
		var graphSessions = null;
        setTimeout(function () {
            graphSessions = Morris.Area({element: 'graph-area-line',
                         behaveLikeLine: false,
                         data: Data,
                         xkey: 'x',
                         ykeys: ['z'],
                         labels: ['Z'],
                         grid:false,
                         lineWidth:1,
                         smooth:false,
                         goals:[0],
                         xLabels:'day',
                         hoverCallback: function(index, options, content) {
                            var row = options.data[index];
                            return "<div class='morris-hover-row-label'>"+row.z+" Sessions</div><div class='morris-hover-point'>"+$scope.getCumulativeMinutesFor(row.y)+ " Minutes</div>";
                        },
                         goalLineColors:['#d9d9d9'],
                         eventLineColors:['#d9d9d9'],
                         /*events:[Data[0].x],*/
                         pointSize:5,
                         pointFillColors:['#ffffff'],
                         pointStrokeColors:['#90c6ec'],
                         lineColors: ['#eff4f8']});
            if ($(".sparkline").length > 0) {
                $(".sparkline").sparkline('html', { enableTagOptions: true, disableHiddenCheck: true});
            }
        }, 50);
    });
