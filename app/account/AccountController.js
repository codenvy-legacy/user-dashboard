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
 * Controller for manipulating user's account sections - Profile, Subscriptions, Billing and Invoices.
 */
angular.module('odeskApp')
    .controller('AccountCtrl', ["$scope", "AccountService", "PaymentService", function ($scope, AccountService, PaymentService) {
        $scope.accounts = [];
        $scope.subscriptions = [];
        $scope.usedMemory = 0;

        //TODO add possibility to register tab:
        $scope.tabs = [
            {
                title: "Profile",
                active: true,
                view: "account/profile.html"
            },
            {
                title: "Subscriptions",
                active: false,
                view: "account/subscription/subscriptions.html"
            },
            {
                title: "Billing and Invoices",
                active: false,
                view: "account/billing/billing.html"
            }
        ];



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
                $scope.getAccountMetrics(accounts[0]);

            });
        }

        $scope.getAccountMetrics = function(account) {
            AccountService.getAccountMetrics(account.id).then(function(){
                $scope.resources = AccountService.resources;
                var saasSubscription = _.find($scope.resources, function (subscription) {
                    return subscription.subscriptionReference.serviceId == "Saas";
                });
                var used = _.pluck(saasSubscription.used, "memory");
                var usedMb = used.reduce(function(sum, use) {
                    sum += use;
                    return sum;
                });
                $scope.usedMemory = (usedMb / 1024 / 60).toFixed(2);
                console.log($scope.usedMemory);
            });
        }

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

        }

        $scope.selectBillingTab = function() {
            $scope.tabs[2].active = true;
        }

    }]);
