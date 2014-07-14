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
        $scope.projects = [];
		$scope.TimeSpan = 'Last 1 Week';
		$scope.factories = [];
		getFactories();
        
		var factoriesConcatUrl;
		var factories;
		
		function replaceURL(originalURL){
			return originalURL.replace('https://next.codenvy-stg.com', 'http://localhost:9000');
		}
        
        Workspace.all(function (resp) {
			$scope.workspaces = resp;
            // angular.forEach(resp, function (value) {
                // $http({method: 'GET', url: replaceURL(value.workspaceRef.workspaceLink.href)}).
                    // success(function (data, status) {
                        // $http({method: 'GET', url: replaceURL(data.links[0].href)}).
                            // success(function (data1, status1) {
                                // $scope.projects = $scope.projects.concat(data1);
                            // });
                    // });
            // });
        });
        
		$scope.ChangeTimeSpan = function(selection){
			$scope.TimeSpan = selection;
			getFactoryStats()
		}
		
		function getFactoryInformation(){
			$scope.factories.forEach(function (factory){
				var _uri = '/api/factory/' + factory.id; 
				
				$http.get(_uri).success(function(data, status){
					var _factory = _.find($scope.factories, function(fct){ if(fct.id == data.id) return fct; });
					_factory.projectname = data.projectattributes.pname;
					_factory.description = data.description;
					//_factory.logo = data.links[4].href;
					_factory.created = data.created;
					_factory.seeURL = data.links[0].href;
				});
			});
		}
		
		function getFactoryStats(){
			
			var currentDate = new Date();
			var toDate = new Date();
			
			if($scope.TimeSpan == 'Last 1 Week')
				toDate.setDate(currentDate.getDate() - 7);
			else if($scope.TimeSpan == 'Last 1 Month')
				toDate.setMonth(currentDate.getMonth() - 1);
			else if($scope.TimeSpan == 'Last 3 Months')
				toDate.setMonth(currentDate.getMonth() - 3);
			
			var uri = '/api/analytics/metric/factory_statistics_list';
			uri = uri + '?from_date=' + formatDate(toDate);
			uri = uri + '&to_date=' + formatDate(currentDate);
			
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
				getFactoryStats();
			});
		}
		
		function getIDFromFactoryURL(factoryURL){
			var index = factoryURL.lastIndexOf('id=');
			if((index + 3 < factoryURL.length) & ((factoryURL[index - 1] == '&') || (factoryURL[index - 1] == '?'))){
				return factoryURL.slice(index + 3, factoryURL.length);
			}
		}
		
        $scope.filter = {};
        var Data = [{x: '2011 Q1', y: 3, z: 3},
                                {x: '2011 Q2', y: 2, z: 1},
                                {x: '2011 Q3', y: 2, z: 4},
                                {x: '2011 Q4', y: 3, z: 3},
                                {x: '2011 Q5', y: 3, z: 4}];
        $timeout(function () {
            Morris.Line({element: 'graph-area-line',
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
                         lineColors: ['#e5e5e5']});

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
