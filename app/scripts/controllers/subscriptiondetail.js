/*jslint
    browser: true,
    devel:true ,
    node:true,
    nomen: true,
    es5:true
*/

/**
 * @auth Gurdev Singh
 * @date 07/23/2014
 * Controller for Subscription Details
 */

/*global angular, Morris*/

'use strict';
angular.module('odeskApp')
    .controller('SubscriptionDetailsCtrl', function ($scope, $timeout, $http, Account,Users,$route) {
    	var subscriptionId = $route.current.params.id;
        $scope.subscriptionAttributes = {};
        $scope.contractStartDate = undefined;
		$scope.trialEndDate = '---';
        $http.get('/api/account/subscriptions/'+subscriptionId).success(function(data, status){
            $scope.subscription = data;
                $http.get(data.links[2].href).success(function(datab, status){
                    $scope.subscriptionAttributes = datab;
                    $scope.contractperiod = datab.billingDescriptor.contractTerm 
                    $scope.contractStartDate = datab.billingDescriptor.startDate;
                  
                    if(datab.billingDescriptor.cycleTypeDescriptor.id==1){
                        $scope.autoRenewal = true;
                        var dt = new Date($scope.contractStartDate);
                        dt.setMonth(dt.getMonth() + $scope.contractperiod);
                        $scope.contractRenewalDate = (dt.getMonth()+1) + "/" + dt.getDate() + "/" + dt.getFullYear();
                    }
                    else{
                        $scope.autoRenewal = false;
                        $scope.contractRenewalDate = '---';
                    }
                    
                    
                    //var d = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
        
                    dt.setMonth(dt.getMonth() + $scope.contractperiod);
                    $scope.contractRenewalDate = (dt.getMonth()+1) + "/" + dt.getDate() + "/" + dt.getFullYear();
				    
                  
					//Figure out trial end date = start date + trialDuration (in days)
					// if trial expired then display "---"
					var dtStart = new Date(datab.startDate);
					var temp = dtStart.getTime() + datab.trialDuration * 86400000; // 86400000 = 24h * 3600 secs * 1000 ms
					var dtToday = new Date();
					if(dtToday < temp)
					{   
						var dtTrialEnd = new Date(temp);
						$scope.trialEndDate = (dtTrialEnd.getMonth()+1) + "/" + dtTrialEnd.getDate() + "/" + dtTrialEnd.getFullYear();
					}
                });
        });
    });
