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
        var isCreditCardFormInit = false;

        $scope.accounts = [];
        $scope.creditCards = [];
        $scope.countries = Countries.all();
        $scope.country = Countries.default();
        $scope.creditCard = {};


        AccountService.getAccountsByRole("account/owner").then(function (accounts) {
            $scope.accounts = accounts;
            if (accounts && accounts.length > 0) {
                $scope.loadCreditCards(accounts);
            }
        });

        $scope.loadCreditCards = function () {
            PaymentService.getCreditCards($scope.accounts[0].id).then(function () {
                $scope.creditCards = PaymentService.crediCards;
                if(!$scope.creditCards.length || $scope.creditCards.length === 0){
                    if(!isCreditCardFormInit){
                        initCreditCardForm();
                        isCreditCardFormInit = true;
                    }
                }
            });
        };

        $scope.deleteCreditCard = function (creditCard) {
            PaymentService.deleteCreditCard(creditCard.accountId, creditCard.number).then(function () {
                $scope.loadCreditCards();
            });
        };

        $scope.addCreditCard = function () {
            PaymentService.addCreditCard($scope.accounts[0].id, $scope.creditCard).then(function () {
                $scope.loadCreditCards();
            });
        };

        var initCreditCardForm = function () {
            $('form#creditCardForm').card({
                container: '.cardWrapper',
                formSelectors: {
                    numberInput: 'input#cardNumber',
                    expiryInput: 'input#expiry',
                    cvcInput: 'input#cvv',
                    nameInput: 'input#cardHolder'
                },
                width: 360,
                formatting: true,
                messages: {
                    validDate: 'valid\ndate',
                    monthYear: 'mm/yyyy'
                },
                values: {
                    number: '•••• •••• •••• ••••',
                    name: 'Full Name',
                    expiry: '••/••',
                    cvc: '•••'
                },
                debug: false
            });
        };

    }
);