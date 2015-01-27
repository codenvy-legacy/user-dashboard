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
        $scope.subscriptions = [];
        $scope.accounts = [];

        AccountService.getAccountsByRole("account/owner").then(function (accounts) {
            $scope.accounts = accounts;
            if (accounts && accounts.length > 0) {
                $scope.loadSubscriptions(accounts);
            }
        });

        $scope.loadSubscriptions = function (accounts) {
            AccountService.getAllSubscriptions(accounts).then(function () {
                $scope.subscriptions = AccountService.subscriptions;
                $scope.addSubscriptionProposals();
            });
        }

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

        $scope.addSubscriptionProposals = function () {
            var services = _.pluck($scope.subscriptions, "serviceId");
            var hasOnPremises = services.indexOf("OnPremises") >= 0;
            var hasFactory = services.indexOf("Factory") >= 0;
            var hasSaaS = services.indexOf("Saas") >= 0;

            if (!hasOnPremises) {
                $scope.subscriptions.push(AccountService.getOnPremisesProposalSubscription());
            }

            if (!hasFactory) {
                $scope.subscriptions.push(AccountService.getFactoryProposalSubscription());
            }

            if (!hasSaaS) {
                $scope.subscriptions.push(AccountService.getSAASProposalSubscription());
            }

        }
    }]);
