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

'use strict';
angular.module('odeskApp')
    .controller('FactoriesCtrl', function ($scope, $timeout, $http, Workspace, newFactory, $filter, $window, $modal) {

		$scope.selectedWidget = null;
		$scope.factoryContent = null;
		$scope.selectedProjectElement = "";
		$scope.selectedTemplateElement = "";
		$scope.uploadedFileName = null;

		$scope.resetMessages = function() {
			$scope.factoryConfigurationError = null;
			$scope.factoryConfigurationOK = null;
		}

		$scope.markedErrors = [];

		$scope.templates = [];

		var basicTemplate = {name: "Minimalistic"};
		var advancedTemplate = {name: "Complete"};
		$scope.templates.push(basicTemplate);
		$scope.templates.push(advancedTemplate);
		$scope.selectingTemplate = function(template) {
			$scope.resetMessages();

			if ('Minimalistic' == template.name) {
				$scope.factoryContent = $filter('json')(angular.fromJson({
					"v": "2.0",
					"project": {
						"attributes": {"language": ["java"]},
						"builders": {"default": "maven"},
						"name": "hello-world-jsp",
						"runners": {
							"configs": {
								"system:/java/web/tomcat7": {
									"options": {},
									"ram": 0,
									"variables": {}
								}
							},
							"default": "system:/java/web/tomcat7"
						},
						"type": "maven",
						"visibility": "public"
					},
					"source": {
						"project": {
							"location": "https://github.com/benoitf/hello-world-jsp",
							"type": "git"
						},
						"runners": {}
					},
					"variables": []
				}), 2);
			} else if ('Complete' == template.name) {
				$scope.factoryContent = $filter('json')(angular.fromJson({
					"v": "2.0",
					"project": {
						"attributes": {"language": ["java"]},
						"builders": {"default": "maven"},
						"name": "hello-world-jsp-advanced",
						"runners": {
							"configs": {
								"system:/java/web/tomcat7": {
									"options": {},
									"ram": 0,
									"variables": {}
								}
							},
							"default": "system:/java/web/tomcat7"
						},
						"type": "maven",
						"visibility": "public"
					},
					"source": {
						"project": {
							"location": "https://github.com/benoitf/hello-world-jsp",
							"type": "git"
						},
						"runners": {}
					},
					"variables": []
				}), 2);
			}
		}


		$scope.resetMessages();

		$scope.codemirrorLoaded = function(_editor){
			// Editor part
			var _doc = _editor.getDoc();

			// disable/enable the create button
			_editor.on("update", function(codemirror) {
				var element = angular.element("#create-factory-modal-button");
				// ng-disabled is not working
				if (codemirror.state.lint.marked.length > 0) {
					element.attr("disabled", "disabled");
				} else {
					element.removeAttr("disabled");
				}
			});

		};

		$scope.factoryURL = "Retrieving...";
		$scope.factorySnippetHTML = "Retrieving...";
		$scope.factorySnippetMarkdown = "Retrieving...";

		$scope.loadFactorySnippets = function(factoryId) {
			var _uri = '/api/factory/' + factoryId;
			$http.get(_uri).success(function (data, status) {

				for (var l = 0; l < data.links.length; l++) {
					var link = data.links[l];
					if ("create-project" == link.rel) {
						$scope.factoryURL = link.href;
					} else if ("snippet/markdown" == link.rel) {
						$http.get(link.href).success(function (data, status) {
							$scope.factorySnippetMarkdown = data;
						}).error(function (data) {
								$scope.factorySnippetMarkdown = "Error: " + $filter('json')(data, 2);
						});
					} else if ("snippet/html" == link.rel) {
						$http.get(link.href).success(function (data, status) {
							$scope.factorySnippetHTML = data;
						}).error(function (data) {
							$scope.factorySnippetHTML = "Error: " + $filter('json')(data, 2);
						});
					}
				}
			});
		}


		$scope.openSnippets = function(factoryId) {
			// load snippets details
			$scope.loadFactorySnippets(factoryId);

			// open modal
			$modal.open({
				templateUrl: 'partials/templates/factories/shareFactoryModal.html',
				size: 'lg',
				scope: $scope
			});
		}

		$scope.selectWidget = function(name) {
			$scope.selectedWidget = name;
		}

		$scope.selectingProject = function($item, $model) {
			$scope.resetMessages();

			// now try to get config of the selected project
			var _uri = '/api/factory/' + $item.workspaceId + '/' + $item.name;
			$http.get(_uri).success(function (data, status) {
				// remove links for display (links are automatically generated so no need to display them)
				delete data.links;
				$scope.factoryContent = $filter('json')(data, 2);
				$scope.factoryConfigurationOK = "Successfully load project's configuration " + $item.name;
			}).error(function (data,status) {
				$scope.factoryConfigurationError = $filter('json')(data, 2);
			});

		}


		$scope.createFactory = function($item) {
			$scope.resetMessages();

			var _uri = '/api/factory/';

			var formDataObject = new FormData();
			formDataObject.append("factoryUrl", $scope.factoryContent);

			$http.post(_uri, formDataObject, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			}).success(function(data){
				var factoryId = data.id;
				// redirect to the as it has been removed
				$item.$close();
				// redirect to factories as it has been removed
				$window.location.href="#/factory/" + factoryId;

			})
				.error(function(data){
					$scope.factoryConfigurationError = $filter('json')(data, 2);
					console.log("error", data)
				});

		}

		$scope.param = 'views';
		$scope.reverse = true;
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
			//getFactoryStats();
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
				
				$http.post('/api/analytics/metric/factory_used/list', reqData, con)
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
				.error(function (data, status) {
				  //As we are keeping count of request/response, it's important to handle error case too.
				  $scope.nCountFactories++;
				  if($scope.nCountFactories==$scope.factories.length){
						// redraw chart
						graphSessions.setData($scope.dailyUses);
					}
                });
								
			});
		}
		
		var clearStatsData = function() {
			
		}
	
	
        $scope.projects = [];

		Workspace.all(function (resp) {
			$scope.workspaces = _.filter(resp, function (workspace) {return !workspace.workspaceReference.temporary;});

			angular.forEach($scope.workspaces, function (value) {
				// Get list of projects
				$http({method: 'GET', url: $.map(value.workspaceReference.links,function(obj){if(obj.rel=="get projects") return obj.href})[0]}).
					success(function (data, status) {
						$scope.projects = $scope.projects.concat(data);
					});
			});
		});


		$scope.factories = [];
		getUserFactories();
        
		var factoriesConcatUrl;
		var factories;

        Workspace.all(function (resp) {
			$scope.workspaces = resp;
        });


		/**
		 * Open the new factory modal dialog
		 */
		$scope.createNewFactory = function () {
			newFactory.open();
		};


		function getUserFactoryInformation(){
			$scope.factories.forEach(function (factory){
				var _uri = '/api/factory/' + factory.id;
				$http.get(_uri).success(function(data, status){
					var _factory = _.find($scope.factories, function(fct){ if(fct.id == data.id) return fct; });
					_factory.id = data.id;
					_factory.projectname = data.project.name;
					if (_factory.projectname == null) {
						_factory.projectname = "undefined";
					}
					_factory.description = data.project.description;
					if (_factory.description == null) {
						_factory.description = "undefined";
					}
					//_factory.logo = data.links[4].href;
					_factory.created = data.creator.created;
					_factory.version = data.v;
					_factory.seeURL = data.links[5].href;

					// Add analytics data
					var analyticsUri = '/api/analytics/metric/factory_used?factory=https%3A%2F%2Fcodenvy.com%2Ffactory%3Fid%3D' + factory.id;

					$http.get(analyticsUri).success(function(data, status){
						_factory.views = parseInt(data.value);

						// Not yet available
						_factory.gigahours = "---";
					});

				});





			});
		}
		function getFactoryInformation(){
			$scope.factories.forEach(function (factory){
				var _uri = '/api/factory/' + factory.id; 
				$http.get(_uri).success(function(data, status){
					var _factory = _.find($scope.factories, function(fct){ if(fct.id == data.id) return fct; });
					_factory.id = data.id;
					_factory.projectname = data.project.name;
					_factory.description = data.project.description;
					//_factory.logo = data.links[4].href;
					_factory.created = data.creator.created;
					_factory.version = data.v;
					_factory.seeURL = data.links[0].href;  //TODO: invalid link
				});
			});
		}
		
		
		function getFactoryStats() {
		
			$scope.factories.forEach(function (factory){
				var con = {
					headers: {
						'Accept': 'application/json',
						'X-Requested-With': 'XMLHttpRequest'
					},
					params:{ from_date:$scope.fromDate,to_date:$scope.toDate, factory:encodeURIComponent(factory.url)},
					cache: true
				};
				
				$http.get('/api/analytics/metric/factory_used',con)
					.success(function (data, status, headers, config) {
					    var facid = getIDFromFactoryURL(decodeURIComponent(config.params.factory));
						var _factory = _.find($scope.factories, function(fct){ if(fct.id == facid) return fct; });
						if(_factory)
							_factory.views = data.value;
					});
					
				$http.get('/api/analytics/metric/factories_built',con)
					.success(function (data, status, headers, config) {
						var facid = getIDFromFactoryURL(decodeURIComponent(config.params.factory));
						var _factory = _.find($scope.factories, function(fct){ if(fct.id == facid) return fct; });
						if(_factory)
							_factory.builds = data.value;
					});
					
				$http.get('/api/analytics/metric/factories_run',con)
					.success(function (data, status, headers, config) {
						var facid = getIDFromFactoryURL(decodeURIComponent(config.params.factory));
						var _factory = _.find($scope.factories, function(fct){ if(fct.id == facid) return fct; });
						if(_factory)
							_factory.runs = data.value;
					});
					
				$http.get('/api/analytics/metric/factories_imported',con)
					.success(function (data, status, headers, config) {
						var facid = getIDFromFactoryURL(decodeURIComponent(config.params.factory));
						var _factory = _.find($scope.factories, function(fct){ if(fct.id == facid) return fct; });
						if(_factory)
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



		function getUserFactories(){
			var userid;
			$http.get('/api/user').success(function (data) {
				userid = data["id"];

				// Now, get all factories created by this user
				$http.get('/api/factory/find?id=&v=2.0&v=2.1&creator.userId=' + userid).success(function(data, status) {

					data.forEach(function(factory){
   					var factoryURL = factory.href.trim();
						var obj = {"url":factoryURL, "id":getIDFromFactoryAPIURL(factoryURL)};
						if(obj.id){
							$scope.factories.push(obj);
						}
						//factoriesConcatUrl = factoriesConcatUrl + encodeURIComponent(factoryURL) + separator;
					});
					//if(factoriesConcatUrl.length > 8)
					//	factoriesConcatUrl = factoriesConcatUrl.slice(0, factoriesConcatUrl.length - 8);

					getUserFactoryInformation();

				});

			}).error(function (err) {
				console.log("Unable to get user id");
			});


		}


		function getFactories(){
			$http.get('/api/analytics/metric/active_factories_set').success(function(data, status){
				// Parse Comma Separated Values in data.value;

				factories = data.slice(1, -1).split(', ');

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

		function getIDFromFactoryAPIURL(factoryURL){
			var index = factoryURL.lastIndexOf('/factory/');
			if(index > 0){
				return factoryURL.slice(index + '/factory/'.length , factoryURL.length);
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
                         lineColors: ['#c0c0c0']});
			$scope.isGraphDrawnForDays = $scope.isDays;
		}
		
        $timeout(function () {
          
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

			$(document).on("mouseenter","#graph-area-line", function() {
				$(".morris-hover").show();
			});
			
			$(document).on("mouseleave","#graph-area-line", function() {
				$(".morris-hover").hide();
			});
		
		});
		
    });
