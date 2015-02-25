/*jslint
 browser: true,
 devel:true ,
 node:true,
 nomen: true,
 es5:true
 */

/**
 * @author Oleksii Orel
 * @author Ann Shumilova
 * @date 23/01/2015
 * Controller for billing info, invoices, credit cards.
 */

'use strict';
angular.module('odeskApp')
    .controller('BillingCtrl', function ($scope, $timeout, Countries, AccountService, PaymentService, InvoiceService, ProfileService) {
        $scope.accounts = [];
        $scope.creditCards = [];
        $scope.countries = Countries.all();
        $scope.creditCard = {};
        $scope.addCreditCardError = '';
        $scope.usedMemory = 0;
        $scope.profile = {};
        $scope.invoices = [];

        AccountService.getAccountsByRole("account/owner").then(function (accounts) {
            $scope.accounts = accounts;
            if (accounts && accounts.length > 0) {
                $scope.loadCreditCards(accounts);
                $scope.loadInvoices(accounts[0]);
                $scope.getAccountResources(accounts[0]);
            }
        });

        ProfileService.getProfile().then(function () {
            $scope.profile = ProfileService.profile;
            $scope.initCreditCard();
        });

        $scope.initCreditCard = function() {
            $scope.creditCard = {};
            var firstName = $scope.profile.attributes.firstName;
            var lastName = $scope.profile.attributes.lastName;
            //TODO plugin is not updating it's value, need to find out: $scope.creditCard.cardholderName = firstName && lastName ? firstName + " " + lastName : "";
            $scope.creditCard.country = $scope.profile.attributes.country || Countries.default();
        }

        $scope.getAccountResources = function(account) {
            AccountService.getAccountResources(account.id).then(function() {
                $scope.usedMemory = AccountService.getUsedMemory(AccountService.resources);
            });
        };

        $scope.loadCreditCards = function () {
            PaymentService.getCreditCards($scope.accounts[0].id).then(function () {
                $scope.creditCards = PaymentService.crediCards;
            });
        };

        $scope.loadInvoices = function () {
            InvoiceService.getInvoices($scope.accounts[0].id).then(function () {
                $scope.invoices = InvoiceService.invoices;
                angular.forEach($scope.invoices, function(invoice) {
                    var link = _.find(invoice.links, function(link) {
                        return link.rel == "html view";
                    })
                    if (link) {
                        invoice.viewLink = link.href;
                    }
                });
            });
        };

        $scope.deleteCreditCard = function (creditCard) {
            PaymentService.deleteCreditCard(creditCard.accountId, creditCard.number).then(function () {
                $scope.loadCreditCards();
            });
        };

        $scope.addCreditCard = function () {
            if(!$scope.creditCard.number){
                $('#cardNumber').attr("required", "required");
                return;
            }
            if(!$scope.creditCard.cardholderName){
                $('#cardHolder').attr("required", "required");
                return;
            }
            if(!$scope.creditCard.expirationDate){
                $('#expiry').attr("required", "required");
                return;
            }
            if(!$scope.creditCard.cvv){
                $('#cvv').attr("required", "required");
                return;
            }
            PaymentService.addCreditCard($scope.accounts[0].id, $scope.creditCard).then(function () {
                $('#warning-creditCard-alert .alert-danger').hide();
                $scope.initCreditCard();
                $scope.loadCreditCards();
            }, function (error) {
                $scope.addCreditCardError = error.message ? error.message : "Add credit card failed.";
                $('#warning-creditCard-alert .alert-danger').show();
                $('#warning-creditCard-alert .alert-danger').mouseout(function () { $(this).fadeOut('slow'); });
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
        initCreditCardForm();
    }
);