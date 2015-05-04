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
        var cancelPayAsYouGoTooltip = "Remove your credit card to return to a SaaS Free Account.";
        var cancelPrePaidTooltip = "Cancel your pre-paid subscription.";
        var cancelOnPromisesTooltip = "Cancel your on-prem subscription.";

        var cancelPayAsYouGoLink = "#/account/billing";
        var cancelPrePaidLink = "mailto:sales@codenvy.com?subject=" + escape("Cancellation of Pre-Paid Subscription");
        var cancelOnPromisesLink = "mailto:sales@codenvy.com?subject=" + escape("Cancellation of On-Prem Subscription");



        $scope.accounts = [];
        $scope.subscriptions = [];
        $scope.SAAS_SERVICE_ID = AccountService.SAAS_SERVICE_ID;

        AccountService.getAccountsByRole("account/owner").then(function (accounts) {
            $scope.accounts = accounts;
            if (accounts && accounts.length > 0) {
                $scope.loadSubscriptions(accounts);
            }
        });

        $scope.loadSubscriptions = function (accounts) {
            AccountService.getAllSubscriptions(accounts).then(function () {
                $scope.subscriptions = AccountService.subscriptions;
                angular.forEach($scope.subscriptions, function(subscription) {
                    if (subscription.serviceId === $scope.SAAS_SERVICE_ID) {
                        var prepaidGbH = subscription.properties.PrepaidGbH;
                        subscription.cancelTooltip = prepaidGbH && parseInt(prepaidGbH) > 0 ? cancelPrePaidTooltip : cancelPayAsYouGoTooltip;
                        subscription.cancelLink = prepaidGbH && parseInt(prepaidGbH) > 0 ? cancelPrePaidLink : cancelPayAsYouGoLink;
                    } else if (subscription.serviceId === AccountService.ONPREMISES_SERVICE_ID) {
                        subscription.cancelTooltip = cancelOnPromisesTooltip;
                        subscription.cancelLink = cancelOnPromisesLink;
                    }
                });
                $scope.addSubscriptionProposals();
            });
        };

        $scope.addSubscriptionProposals = function () {
            var services = _.pluck($scope.subscriptions, "serviceId");
            var hasOnPremises = services.indexOf(AccountService.ONPREMISES_SERVICE_ID) >= 0;

            var saasSubscription = _.find($scope.subscriptions, function (subscription) {
                return subscription.serviceId == $scope.SAAS_SERVICE_ID;
            });

            if (saasSubscription) {
                if (saasSubscription.properties && saasSubscription.properties["Package"] && saasSubscription.properties["Package"] == "Community"){
                    $scope.subscriptions.splice($scope.subscriptions.indexOf(saasSubscription), 1);
                    $scope.subscriptions.push(AccountService.getSAASProposalSubscription());
                } else {
                    var prepaidGbH = 0;
                    if(saasSubscription.properties.PrepaidGbH) {
                        prepaidGbH = saasSubscription.properties.PrepaidGbH;
                    }
                    $scope.subscriptions.splice($scope.subscriptions.indexOf(saasSubscription), 1);
                    $scope.subscriptions.push(AccountService.getPrepaidProposalSubscription(prepaidGbH));
                }
            } else {
                $scope.subscriptions.push(AccountService.getSAASProposalSubscription());
            }

            if (!hasOnPremises) {
                $scope.subscriptions.push(AccountService.getOnPremisesProposalSubscription());
            }
        };

        $scope.buySubscription = function(subscription) {
            if (subscription.serviceId === $scope.SAAS_SERVICE_ID) {
                $location.path("/account/billing");
            } else if (subscription.serviceId === AccountService.ONPREMISES_SERVICE_ID) {
                $modal.open({
                    templateUrl: 'account/subscription/buyOnPremSubscriptionModal.html',
                    size: 'lg',
                    scope: $scope,
                    subscription: subscription
                }).result;
            }
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
