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
    .controller('AccountCtrl', ["$scope", "AccountService", function ($scope, AccountService) {
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

        $scope.selectBillingTab = function() {
            $scope.tabs[2].active = true;
        }


    }]);
