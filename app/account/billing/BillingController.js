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
    .controller('BillingCtrl', function ($scope, $timeout, $modal, Countries, AccountService, PaymentService, InvoiceService, ProfileService) {
        $scope.accounts = [];
        $scope.balance =  0;
        $scope.creditCards = [];
        $scope.countries = Countries.all();
        $scope.creditCard = {};
        $scope.showNewCreditCardForm = false;
        $scope.addCreditCardError = '';
        $scope.usedMemory = 0;
        $scope.prepaidGbH = 0;
        $scope.freeGbH = 0;
        $scope.profile = {};
        $scope.invoices = [];
        $scope.isNewCreditCardAdded = false;
        $scope.isLocked = false;

        var oldCardContainerClasses = null;
        var defaultCardValues = {
            number: '&bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull;',
            name: 'Full Name',
            expiry: '&bull;&bull;/&bull;&bull;',
            cvc: '&bull;&bull;&bull;'
        };

        var getSubscriptionResources = function() {
            $scope.prepaidGbH = AccountService.getPrepaidGbH(AccountService.subscriptions);
            //TODO realise method to get free GbH from server part
            $scope.freeGbH = 10;
        };

        AccountService.getAccountsByRole("account/owner").then(function (accounts) {
            $scope.accounts = accounts;
            if (accounts && accounts.length > 0) {
                $scope.loadCreditCards(accounts);
                $scope.loadInvoices(accounts[0]);
                $scope.getAccountResources(accounts[0]);
                $scope.getAccountAttributes(accounts[0]);
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
                getSubscriptionResources();
            });
        };

        $scope.getAccountAttributes = function (account) {
            AccountService.getAccountDetails(account.id).then(function () {
                $scope.isLocked = !!(AccountService.accountDetails.attributes[AccountService.RESOURCES_LOCKED_PROPERTY]
                && AccountService.accountDetails.attributes[AccountService.RESOURCES_LOCKED_PROPERTY] === 'true');
            });
        };

        $scope.loadCreditCards = function () {
            PaymentService.getCreditCards($scope.accounts[0].id).then(function () {
                $scope.creditCards = PaymentService.crediCards;
                $scope.showNewCreditCardForm = $scope.creditCards && $scope.creditCards.length == 0;
                if ($scope.isNewCreditCardAdded){
                    angular.element("#creditCardPanel").focus();
                    $scope.isNewCreditCardAdded = false;
                    AccountService.addSubscription($scope.accounts[0].id, AccountService.SAAS_PLAN_ID, true);
                }
            });
        };

        $scope.loadInvoices = function () {
            InvoiceService.getInvoices($scope.accounts[0].id).then(function () {
                $scope.invoices = InvoiceService.invoices;
                $scope.balance = 0;
                angular.forEach($scope.invoices, function(invoice) {
                    $scope.balance += invoice.total;
                    var link = _.find(invoice.links, function(link) {
                        return link.rel == "html view";
                    })
                    if (link) {
                        invoice.viewLink = link.href;
                    }
                });
            });
        };

        $scope.confirmCreditCardDeletion = function (creditCard) {
            $scope.creditCardToRemove = creditCard;

            $modal.open({
                templateUrl: 'account/billing/removeCreditCardModal.html',
                size: 'lg',
                scope: $scope
            }).result;
        };

        $scope.deleteCreditCard = function (creditCard) {
            PaymentService.deleteCreditCard(creditCard.accountId, creditCard.number).then(function () {
                $scope.loadCreditCards();
                $scope.getAccountAttributes($scope.accounts[0]);
                $timeout(function () {
                    AccountService.getAllSubscriptions($scope.accounts).then(function () {
                        getSubscriptionResources();
                    });
                }, 5000);
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
                $scope.showNewCreditCardForm = false;
                $scope.isNewCreditCardAdded = true;
                $scope.loadCreditCards();
                $scope.getAccountAttributes($scope.accounts[0]);

                //Clear credit card widget and set default values
                var cardContainer = $('.cardWrapper .card-container  div.card')[0];
                oldCardContainerClasses = cardContainer.getAttribute('class');
                cardContainer.setAttribute('class', 'card');
                $('.cardWrapper .card-container  div.number')[0].innerHTML = defaultCardValues.number;
                $('.cardWrapper .card-container  div.name')[0].innerHTML = defaultCardValues.name;
                $('.cardWrapper .card-container  div.expiry')[0].innerHTML = defaultCardValues.expiry;
                $timeout(function () {
                    AccountService.getAllSubscriptions($scope.accounts).then(function () {
                        getSubscriptionResources();
                    });
                }, 5000);
            }, function (error) {
                $scope.addCreditCardError = error.message ? error.message : "Add credit card failed.";
                $('#warning-creditCard-alert .alert-danger').show();
                $('#warning-creditCard-alert .alert-danger').mouseout(function () { $(this).fadeOut('slow'); });
            });
        };

        $scope.checkCardStyle = function () {
            if (oldCardContainerClasses === null) {
                return;
            }
            var cardContainer = $('.cardWrapper .card-container  div.card')[0];
            if(cardContainer.getAttribute('class') === 'card') {
                cardContainer.setAttribute('class', oldCardContainerClasses);
            }
            oldCardContainerClasses = null;
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
                values: defaultCardValues,
                debug: false
            });

        };
        initCreditCardForm();
    }
);