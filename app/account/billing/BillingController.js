/*jslint
 browser: true,
 devel:true ,
 node:true,
 nomen: true,
 es5:true
 */

/**
 * @author Oleksii Orel
 * @date 23/01/2015
 * Controller for runners
 */

'use strict';
angular.module('odeskApp')
    .controller('BillingCtrl', function ($scope, $timeout, Countries, AccountService, PaymentService) {

        $scope.ownerAccounts = [];
        $scope.creditCards = [];
        $scope.countries = Countries.all();
        $scope.country = Countries.default();


        $scope.deleteCreditCard = function (creditCard) {
            var accountId = creditCard.accountId;
            var number = creditCard.number;
            PaymentService.deleteCreditCard(accountId, number).then(function () {
                var removedCreditCardIndex = -1;
                angular.forEach($scope.creditCards, function (creditCard, index) {
                    if (creditCard.number === number) {
                        removedCreditCardIndex = index;
                    }
                });
                if (removedCreditCardIndex > -1) {
                    $scope.creditCards.splice(removedCreditCardIndex, 1);
                }
            });
        };

        var init = function () {
            $scope.creditCards = PaymentService.crediCards;
        };
        init();
    }
);