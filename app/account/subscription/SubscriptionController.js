/*jslint
 browser: true,
 devel:true ,
 node:true,
 nomen: true,
 es5:true
 */

/**
 * @auth Ann Shumilova
 * @date
 * Controller for manipulating subscriptions.
 */
angular.module('odeskApp')
    .controller('SubscriptionCtrl', ["$scope", "AccountService", "$modal", function ($scope, AccountService, $modal) {






        $scope.buySubscription = function(subscription) {
            AccountService.buySubscription(subscription);
        }

        $scope.upgradeSubscription = function(subscription) {
            $scope.selectBillingTab();
        }

        $scope.confirmCancelSubscription = function (subscription) {
            $scope.subscription = subscription;
            $modal.open({
                templateUrl: 'account/subscription/cancelSubscriptionModal.html',
                size: 'lg',
                scope: $scope,
                subscription: subscription
            }).result;
        }


    }]);
