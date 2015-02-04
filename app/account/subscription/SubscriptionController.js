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
    .controller('SubscriptionCtrl', ["$scope", "AccountService", "$modal", "$location", function ($scope, AccountService, $modal, $location) {

        $scope.accounts = [];
        $scope.subscriptions = [];
        $scope.usedMemory = 0;

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
                //TODO need decision when more then one account:
                $scope.getAccountResources(accounts[0]);

            });
        };

        $scope.getAccountResources = function(account) {
            AccountService.getAccountResources(account.id).then(function() {
                $scope.usedMemory = AccountService.getUsedMemory(AccountService.resources);
            });
        };

        $scope.addSubscriptionProposals = function () {
            var services = _.pluck($scope.subscriptions, "serviceId");
            var hasOnPremises = services.indexOf("OnPremises") >= 0;
            var hasFactory = services.indexOf("Factory") >= 0;

            if (!hasOnPremises) {
                $scope.subscriptions.push(AccountService.getOnPremisesProposalSubscription());
            }

            if (!hasFactory) {
                $scope.subscriptions.push(AccountService.getFactoryProposalSubscription());
            }

            var saasSubscription = _.find($scope.subscriptions, function (subscription) {
                return subscription.serviceId == "Saas";
            });

            if (saasSubscription) {
                if (saasSubscription.properties && saasSubscription.properties["Package"] && saasSubscription.properties["Package"] == "Community"){
                    saasSubscription.description = "SAAS Free Account";
                    saasSubscription.needToBut = false;
                    saasSubscription.needToUpgrade = true;
                }
            } else {
                $scope.subscriptions.push(AccountService.getSAASProposalSubscription);
            }

        };

        $scope.buySubscription = function(subscription) {
            AccountService.buySubscription(subscription);
        }

        $scope.upgradeSubscription = function(subscription) {
            $location.path("/account/billing");
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
