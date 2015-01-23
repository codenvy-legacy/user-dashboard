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
    .controller('SubscriptionCtrl', ["$scope", "AccountService", function ($scope, AccountService) {
        $scope.subscriptions = [];

        AccountService.getAccountsByRole("account/owner").then(function (accounts) {
            if (accounts && accounts.length > 0) {
                AccountService.getAllSubscriptions(accounts).then(function () {
                    $scope.subscriptions = AccountService.subscriptions;
                    $scope.addSubscriptionProposals();
                });
            }
        });

        $scope.addSubscriptionProposals = function() {
            var hasOnPremises = false;
            var hasFactoryTerm = false;
            var hasSaaS = false;



        }

    }]);
