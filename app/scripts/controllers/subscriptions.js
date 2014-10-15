/*jslint
    browser: true,
    devel:true ,
    node:true,
    nomen: true,
    es5:true
*/

/**
 * @auth Gurdev Singh
 * @date 07/18/2014
 * Controller for Subscriptions
 */

/*global angular, Morris*/

'use strict';
angular.module('odeskApp')
    .controller('SubscriptionsCtrl', function ($scope, $timeout, $http, Account,Users) {
        $scope.subscriptions = [];
        $scope.stDates = [];
        $scope.endDates = [];
		$scope.trialEndDates = [];
        $scope.desc = [];
        var nbSubscriptions=0;
        $scope.subscription = 'FALSE';
        $scope.isTrialEnd ='FALSE';
        Users.query().then(function(data){
            for (var j = data.length - 1; j >= 0; j--) {
                var ref = data[j].accountReference;
                if(ref.id!=undefined)
                {
                    //Get the account's susbcription only if user = accountOwner
                    var isAccountOwner= false;

                    for (var iAccount = data[j].roles.length - 1; iAccount >= 0; iAccount--) {
                        if (data[j].roles[iAccount] == "account/owner") isAccountOwner=true;
                    };

                    if (isAccountOwner) {
                        $http.get('/api/account/'+ref.id+'/subscriptions').success(function(datab, status){
                            for(var i=0;i<datab.length;i++)
                            {
                                setData(datab[i],nbSubscriptions);
                                nbSubscriptions++;
                            }
                        });
                    }
                }
            };
        });
        
        
        function setData(dataSub,numSubscription)
        {       
            $http.get('/api/account/subscriptions/'+dataSub.id+'/attributes').success(function(detailsSub, status){
                $scope.subscription = 'TRUE';          
                $scope.subscriptions[numSubscription] = dataSub;
                $scope.stDates[numSubscription] = detailsSub.startDate;
                $scope.endDates[numSubscription] = detailsSub.endDate;
                $scope.desc[numSubscription] = detailsSub.description;
            
				var dtStart = new Date(detailsSub.startDate);
				var tempTime = dtStart.getTime() + (detailsSub.trialDuration * 86400000); // 86400000 = 24h * 3600 secs * 1000 ms
				var dtToday = new Date();
    
                if(dtToday < tempTime)
				{
                    $scope.isTrialEnd ='TRUE';
					var dtTrialEnd = new Date(tempTime);
					$scope.trialEndDates[numSubscription] = (dtTrialEnd.getMonth()+1) + "/" + dtTrialEnd.getDate() + "/" + dtTrialEnd.getFullYear();
				}
				else
                {
					$scope.isTrialEnd ='FALSE';
                    $scope.trialEndDates[numSubscription] = '---';
                }

                }).error(function(status){
                    if(status==404)
                    {
                        $scope.subscription = 'FALSE';
                    }

             });
        }

        $scope.isExpired=function(endDate)
        {
            var end = new Date(endDate).getTime();
            var today = new Date().getTime();
            
            if(today > end)
                {
                    return 'true';
                }
            else{
                    return 'false';
                }

        }
    });
