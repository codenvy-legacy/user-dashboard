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

        $scope.cancelSubscription = function (subscription) {
            AccountService.removeSubscription(subscription.id).then(function () {
                $scope.loadSubscriptions($scope.accounts);
            });
        }

        $scope.confirmCancelSubscription = function (subscription) {
            $scope.subscription = subscription;
            $modal.open({
                templateUrl: 'account/subscription/cancelSubscriptionModal.html',
                size: 'sm',
                scope: $scope,
                subscription: subscription
            }).result;
        }


    }]);
