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
 * Service for maintaining user's account.
 */

/*global angular*/
'use strict';
angular.module('odeskApp')
    .factory('AccountService', ['$http', '$q', '$window', '$location', function AccountService($http, $q, $window, $location) {
        AccountService.BUY_SUBSCRIPTIONS_LINK = "http://codenvy.com/products/developer-environment-cloud-saas/";
        AccountService.SAAS_SERVICE_ID = "Saas";
        AccountService.SAAS_PLAN_ID = "pay-as-you-go";
        AccountService.SAAS_PREPAID_PLAN_ID = "prepaid";
        AccountService.ONPREMISES_SERVICE_ID = "OnPremises";
        AccountService.RESOURCES_LOCKED_PROPERTY = "codenvy:resources_locked";
        AccountService.subscriptions = [];
        AccountService.accounts = [];
        AccountService.resources = {};
        AccountService.accountDetails = {};

        //Get all accounts, where the current user has membership:
        AccountService.getAccounts = function () {
            var deferred = $q.defer();
            var con = {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            };
            $http.get('/api/account/', con)
                .success(function (data) {
                    AccountService.accounts = data;
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) {
                    deferred.reject();
                });
            return deferred.promise;
        };

        //Get all accounts, where the current user has pointed role:
        AccountService.getAccountsByRole = function (role) {
            var deferred = $q.defer();
            AccountService.getAccounts().then(function () {
                var accounts = [];
                angular.forEach(AccountService.accounts, function (membership) {
                    if (membership.roles.indexOf(role) >= 0) {
                        accounts.push(membership.accountReference);
                    }
                });
                deferred.resolve(accounts);
            });
            return deferred.promise;
        };

        //Get all accounts, where the current user has pointed role:
        AccountService.getAccountResources = function (accountId) {
            var deferred = $q.defer();
            var con = {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            };
            $http.get('/api/account/' + accountId + "/resources", con)
                .success(function (data) {
                    AccountService.resources = data;
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) {
                    deferred.reject();
                });

            return deferred.promise;
        };

        //Get account details by it's id
        AccountService.getAccountDetails = function (accountId) {
            var deferred = $q.defer();
            var con = {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            };
            $http.get('/api/account/' + accountId, con)
                .success(function (data) {
                    AccountService.accountDetails = data;
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) {
                    deferred.reject();
                });

            return deferred.promise;
        };

        AccountService.setAccountResources = function (accountId, resources) {
            var deferred = $q.defer();
            var con = {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            };
            $http.post('/api/account/' + accountId + "/resources",  resources, con)
                .success(function () {
                    deferred.resolve();
                })
                .error(function (err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        };

        AccountService.getUsedMemory = function (resources) {
            var saasSubscription = _.find(resources, function (subscription) {
                return subscription.subscriptionReference.serviceId == AccountService.SAAS_SERVICE_ID;
            });
            var used = _.pluck(saasSubscription.used, "memory");
            var usedMb = used.reduce(function(sum, use) {
                sum += use;
                return sum;
            });
            //return (usedMb / 1024 / 60).toFixed(2);
            return (usedMb).toFixed(2);
        };

        AccountService.getPrepaidGbH = function (subscriptions) {
            var saasSubscription = _.find(subscriptions, function (subscription) {
                return subscription.serviceId == AccountService.SAAS_SERVICE_ID;
            });
            if(saasSubscription.properties.PrepaidGbH){
                return saasSubscription.properties.PrepaidGbH;
            }
            return 0;
        };

        //Get list of subscriptions for pointed accounts:
        AccountService.getAllSubscriptions = function (accounts) {
            var subscriptions = [];
            var deferred = $q.defer();
            var promises = [];
            angular.forEach(accounts, function (account) {
                promises.push(
                    AccountService.getSubscriptions(account.id).then(function (data) {
                        subscriptions = subscriptions.concat(data);
                    }));

            });
            $q.all(promises).then(function () {
                AccountService.subscriptions = subscriptions;
                deferred.resolve(subscriptions);
            })
            return deferred.promise;
        };

        //Get list of subscriptions for pointed account:
        AccountService.getSubscriptions = function (accountId) {
            var deferred = $q.defer();
            var con = {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            };
            $http.get('/api/account/' + accountId + '/subscriptions', con)
                .success(function (data) {
                    AccountService.subscriptions = data;
                    deferred.resolve(data);
                })
                .error(function (err) {
                    deferred.reject();
                });
            return deferred.promise;
        };

        AccountService.getMembers = function(accountId) {
            var deferred = $q.defer();
            var con = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            $http.get('/api/account/' + accountId + '/members', con)
                .success(function (data) {
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        AccountService.addMember = function(accountId, userId) {
            var deferred = $q.defer();
            var con = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            var data = {
                "userId": userId,
                "roles": [ "account/member" ]
            };
            $http.post('/api/account/' + accountId + '/members', data, con)
                .success(function (data) {
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        AccountService.removeMember = function(accountId, memberId) {
            var deferred = $q.defer();
            $http.delete('/api/account/' + accountId + '/members/' + memberId)
                .success(function () {
                    deferred.resolve();
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        AccountService.getOnPremisesProposalSubscription = function() {
            return {description : "On-Prem Subscription", buyTooltip: "Purchase a license to use Codenvy behind your firewall in your own private cloud.", needToBuy: true, serviceId: AccountService.ONPREMISES_SERVICE_ID};
        };

        AccountService.getSAASProposalSubscription = function() {
            return {description : "SaaS Pay-as-you-Go Account", buyTooltip: "Add a credit card to use Codenvy without limits.", needToBuy: true, serviceId: AccountService.SAAS_SERVICE_ID};
        };

        //Remove subscription by it's ID:
        AccountService.removeSubscription = function (subscriptionId) {
            var deferred = $q.defer();
            $http.delete('/api/account/subscriptions/' + subscriptionId)
                .success(function (data) {
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) {
                    deferred.reject();
                });
            return deferred.promise;
        };

        AccountService.addSubscription = function (accountId, planId, usePaymentSystem) {
            var data = {};
            data.accountId = accountId;
            data.planId = planId;
            data.usePaymentSystem = usePaymentSystem;
            var con = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            var deferred = $q.defer();
            $http.post('/api/account/subscriptions/', data, con)
                .success(function (data) {
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) {
                    deferred.reject();
                });
            return deferred.promise;
        };

        return AccountService;
    }
    ]);
