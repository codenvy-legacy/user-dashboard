/*jslint
 browser: true,
 devel:true ,
 node:true,
 nomen: true,
 es5:true
 */

/**
 * @auth ann Shumilova
 * @date
 * Service for maintaining subscriptions.
 */

/*global angular*/
'use strict';
angular.module('odeskApp')
    .factory('AccountService', ['$http', '$q', function AccountService($http, $q) {
        AccountService.subscriptions = [];
        AccountService.accounts = [];

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
        }

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
        }

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
        }

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
                    console.log( AccountService.subscriptions);
                    deferred.resolve();
                })
                .error(function (err) {
                    deferred.reject();
                });
            return deferred.promise;
        }

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
        }

        AccountService.addSubscription = function () {
            //TODO
        }

        return AccountService;
    }
    ]);