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
        var temp = [];
        var temp2 = [];
        var num = 0;
        Users.query().then(function(data){
            var ref = data[0].accountReference;
            if(ref.id!=undefined)
            {
                $http.get('/api/account/'+ref.id+'/subscriptions').success(function(datab, status){
                    temp = temp.concat(datab);
                    for(var i=0;i<temp.length;i++)
                    {
                        var sub = temp[i];
                        setData(sub,i);
                    }
                });
            }
        });

        function setData(sub,i)
        {
            $http.get('/api/account/subscriptions/'+sub.id+'/attributes').success(function(datac, status){
                temp2[i] = temp[i];
                $scope.stDates[i] = datac.startDate;
                $scope.endDates[i] = datac.endDate;
                $scope.desc[i] = datac.description;
					
				var dtStart = new Date(datac.startDate);
				var tempTime = dtStart.getTime() + (datac.trialDuration * 86400000); // 86400000 = 24h * 3600 secs * 1000 ms
				var dtToday = new Date();
				if(dtToday < tempTime)
				{
					var dtTrialEnd = new Date(tempTime);
					$scope.trialEndDates[i] = (dtTrialEnd.getMonth()+1) + "/" + dtTrialEnd.getDate() + "/" + dtTrialEnd.getFullYear();
				}
				else
					$scope.trialEndDates[i] = '---';
									
                num++;
                if(num==temp.length)
                {
                    $scope.subscriptions = temp2;
                }
                    
             });
        }
    });
