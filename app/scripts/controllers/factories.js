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
 * Controller for factories
 */

/*global angular, Morris*/

'use strict';
angular.module('odeskApp')
    .controller('FactoriesCtrl', function ($scope, $timeout, $http, Workspace) {
	
		$scope.noOfDays = 30;
		$scope.isDays = true;
		$scope.isGraphDrawnForDays = false;
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

			  if($scope.isDays)
				return year + '-' + month + '-' + day;
			  else
				return 'Week-' + year + '-' + month + '-' + day;
			  
		};
		
		// Used for graph scale
		var getDateStringForGraph = function(d) {
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
		
		var timeSpanChanged = function() {
			var startDate = getStartDate();
			var endDate = new Date();
			
			if($scope.isDays != $scope.isGraphDrawnForDays) // If graph drawn previously has same x unit then no need to redraw it.
				drawMorrisGraph();
			
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
	
			clearStatsData();
			
			getStatsData();
			getFactoryStats1();
		}
		
		$scope.nCountFactories = 0;
		var getStatsData = function() {
						
			// Build request data
			var reqData = [];
			
			angular.forEach($scope.statsData, function(day,key) {
					reqData.push({"from_date":day.sdatestr, "to_date":day.edatestr});
				});
					
			
            
			$scope.nCountFactories = 0;
			$scope.dailyUses = [];
			
            $scope.factories.forEach(function (factory){
				var con = {
					headers: {
						'Content-Type': 'application/json; charset=UTF-8'
					},
					params:{ factory:encodeURIComponent(factory.url)},
					cache:true
				};
				
				$http.post('/api/analytics/metric/product_usage_sessions/list', reqData, con)
                .success(function (data, status) {
					$scope.nCountFactories++;
					var i=0;
					angular.forEach(data.metrics, function(day,key) {
					    var iVal = parseInt(day.value);
						var xVal = getDateStringForGraph($scope.statsData[i].sdate);
						
						var _factory = _.find($scope.dailyUses, function(ses){ if(ses.x == xVal) return ses; });
						if(_factory)
							_factory.z = _factory.z + iVal;
						else
							$scope.dailyUses.push({x:xVal,y:i,z:iVal}); 
							
						i++;
					});
					
					if($scope.nCountFactories==$scope.factories.length){
						// redraw chart
						graphSessions.setData($scope.dailyUses);
					}
                })
								
			});
		}
		
		var clearStatsData = function() {
			
		}
	
	
        $scope.projects = [];
		$scope.factories = [];
		getFactories();
        
		var factoriesConcatUrl;
		var factories;

        Workspace.all(function (resp) {
			$scope.workspaces = resp;
        });
        
		function getFactoryInformation(){
			$scope.factories.forEach(function (factory){
				var _uri = '/api/factory/' + factory.id; 
				$http.get(_uri).success(function(data, status){
					var _factory = _.find($scope.factories, function(fct){ if(fct.id == data.id) return fct; });
					_factory.projectname = data.projectattributes.pname;
					_factory.description = data.description;
					//_factory.logo = data.links[4].href;
					_factory.created = data.created;
					_factory.seeURL = data.links[0].href;  //TODO: invalid link
				});
			});
		}
		
		function getFactoryStats(){
						
			var uri = '/api/analytics/metric/factory_statistics_list';
			uri = uri + '?from_date=' + $scope.fromDate;
			uri = uri + '&to_date=' + $scope.toDate;
			
			//uri = uri + '&' + factoriesConcatUrl;  //ToDo - Send all factories at once when 502 response is resolved.

			$scope.factories.forEach(function (factory){
				var _uri = uri + '&factory=' + encodeURIComponent(factory.url);
				
				$http.get(_uri).success(function(data, status){
					if(data.value.length > 2){
						var temp = JSON.parse(data.value.slice(1, -1));
						var _factory = _.find($scope.factories, function(fct){ if(fct.id == getIDFromFactoryURL(temp.factory)) return fct; });
						_factory.builds = temp.builds;
						_factory.runs = temp.runs;
						_factory.views = temp.sessions;
						_factory.copies = temp.converted_factory_session;
					}
				});
			});
		}
		
		function getFactoryStats1() {
		
			$scope.factories.forEach(function (factory){
				var con = {
					headers: {
						'Accept': 'application/json',
						'X-Requested-With': 'XMLHttpRequest'
					},
					params:{ from_date:$scope.fromDate,to_date:$scope.toDate, factory:encodeURIComponent(factory.url)},
					cache: true
				};
				
				$http.get('/api/analytics/metric/factories_accepted',con)
					.success(function (data, status, headers, config) {
						var _factory = _.find($scope.factories, function(fct){ if(fct.id == getIDFromFactoryURL(config.params.factory)) return fct; });
						_factory.views = data.value;
					});
					
				$http.get('/api/analytics/metric/factories_built',con)
					.success(function (data, status, headers, config) {
						var _factory = _.find($scope.factories, function(fct){ if(fct.id == getIDFromFactoryURL(config.params.factory)) return fct; });
						_factory.builds = data.value;
					});
					
				$http.get('/api/analytics/metric/factories_run',con)
					.success(function (data, status, headers, config) {
						var _factory = _.find($scope.factories, function(fct){ if(fct.id == getIDFromFactoryURL(config.params.factory)) return fct; });
						_factory.runs = data.value;
					});
					
				$http.get('/api/analytics/metric/factories_imported',con)
					.success(function (data, status, headers, config) {
						var _factory = _.find($scope.factories, function(fct){ if(fct.id == getIDFromFactoryURL(config.params.factory)) return fct; });
						_factory.copies = data.value;
					});
			});
		}		
		function formatDate(date){
			var formattedDate = new String();

			formattedDate = date.getFullYear();
			if ((date.getMonth() + 1)<10)
				formattedDate = formattedDate + '0' + date.getMonth();
			else
				formattedDate = formattedDate + date.getMonth();
			
			if (date.getDate() <10)
				formattedDate = formattedDate + '0' + date.getDate();
			else
				formattedDate = formattedDate + date.getDate();
				
			return formattedDate;
		}
		
		function getFactories(){
			$http.get('/api/analytics/metric/active_factories_set').success(function(data, status){
				// Parse Comma Separated Values in data.value;
				
				factories = data.value.slice(1, -1).split(', ');

				factoriesConcatUrl = 'factory=';
				var separator='%20OR%20';
				factories.forEach(function(factory){
				
					var obj = {"url":factory.trim(), "id":getIDFromFactoryURL(factory)};
					if(obj.id){
						$scope.factories.push(obj);
					}
					factoriesConcatUrl = factoriesConcatUrl + encodeURIComponent(factory.trim()) + separator;
				});
				if(factoriesConcatUrl.length > 8)
					factoriesConcatUrl = factoriesConcatUrl.slice(0, factoriesConcatUrl.length - 8);
				
				getFactoryInformation();
				
				timeSpanChanged();
			});
		}
		
		function getIDFromFactoryURL(factoryURL){
			var index = factoryURL.lastIndexOf('id=');
			if((index + 3 < factoryURL.length) & ((factoryURL[index - 1] == '&') || (factoryURL[index - 1] == '?'))){
				return factoryURL.slice(index + 3, factoryURL.length);
			}
		}
		
		
        $scope.filter = {};
		
		var graphSessions = null;
		var drawMorrisGraph = function() {
		    $('#graph-area-line').empty();
			graphSessions = Morris.Area({element: 'graph-area-line',
                         behaveLikeLine: false,
                         data: [{x:'',y:0,z:0} ],
                         xkey: 'x',
                         ykeys: ['z'],
                         labels: ['Z'],
                         grid:false,
                         lineWidth:1,
                         smooth:false,
                         goals:[0],
                         xLabels: $scope.isDays ? 'day' : 'week',
						 xLabelFormat: function(dt) { return getDateStringDispay(dt); },
						 /*xLabelAngle: 15,*/
                         hoverCallback: function(index, options, content) {
                            var row = options.data[index];
                            return "<div class='morris-hover-row-label'>"+row.z+"</div>";
                        },
                         goalLineColors:['#d9d9d9'],
                         eventLineColors:['#d9d9d9'],
                         /*events:[Data[0].x],*/
                         pointSize:5,
                         pointFillColors:['#ffffff'],
                         pointStrokeColors:['#90c6ec'],
                         lineColors: ['#eff4f8']});
			$scope.isGraphDrawnForDays = $scope.isDays;
		}
		
        /*var Data = [{x: '2011 Q1', y: 3, z: 3},
                                {x: '2011 Q2', y: 2, z: 1},
                                {x: '2011 Q3', y: 2, z: 4},
                                {x: '2011 Q4', y: 3, z: 3},
                                {x: '2011 Q5', y: 3, z: 4}];*/
        $timeout(function () {
            /*Morris.Line({element: 'graph-area-line',
                         behaveLikeLine: false,
                         data: Data,
                         xkey: 'x',
                         ykeys: ['z'],
                         labels: ['Z'],
                         grid:false,
                         lineWidth:1,
                         smooth:false,
                         goals:[0],
                         goalLineColors:['#d9d9d9'],
                         eventLineColors:['#d9d9d9'],
                         events:[Data[0].x],
                         pointSize:5,
                         pointFillColors:['#ffffff'],
                         pointStrokeColors:['#90c6ec'],
                         hoverCallback: function(index, options, content) {
                            var row = options.data[index];
                            return "<div class='morris-hover-row-label'>"+row.z+" Sessions</div><div class='morris-hover-point'>235 Minutes</div>";
                        },
                         lineColors: ['#e5e5e5']});*/

        $(document).on( "click", ".searchfield", function() {
            $('.searchfull').show();
            $('.detail').animate({ opacity: 0}, 400);
            $('.searchfull').animate({width: "100%" }, 400, function(){ $(".closeBtn").show(); } );
            
        });
        $(document).on( "click", ".closeBtn", function() {
            $(".closeBtn").hide();
            $('.detail').animate({ opacity: 1}, 400);
            $('.searchfull').animate({width: "43px" }, 400 , function(){ $('.searchfull').hide();   });
        });

        });
		
    });