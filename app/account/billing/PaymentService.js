/**
 * Created by Ann on 1/26/15.
 */
angular.module('odeskApp')
    .constant('clientTokenPath', '/')//need to init BrainTree
    .factory('PaymentService', ['$http', '$q', '$braintree', function PaymentService($http, $q, $braintree) {
        PaymentService.crediCards = [];

        PaymentService.getClientToken = function (accountId) {
            var deferred = $q.defer();
            var con = {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            };
            $http.get('/api/creditcard/' + accountId + "/token", con)
                .success(function (data) {
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        PaymentService.addCreditCard = function (accountId, creditCard) {
            var client;
            var deferred = $q.defer();
            PaymentService.getClientToken(accountId).then(function (data) {
                client = new $braintree.api.Client({
                    clientToken: data.token
                });

                client.tokenizeCard(creditCard, function (err, nonce) {
                    $http.post('/api/creditcard/' + accountId, {nonce: nonce})
                        .success(function (data) {
                            deferred.resolve(data); //resolve data
                        })
                        .error(function (err) {
                            deferred.reject(err);
                        });
                });
            });
            return deferred.promise;
        };

        PaymentService.getCreditCards = function (accountId) {
            var deferred = $q.defer();
            var con = {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            };
            $http.get('/api/creditcard/' + accountId, con)
                .success(function (data) {
                    PaymentService.crediCards = data;
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        PaymentService.deleteCreditCard = function (accountId, creditCardNumber) {
            var deferred = $q.defer();

            $http.delete('/api/creditcard/' + accountId + "/" + creditCardNumber)
                .success(function (data) {
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        return PaymentService;
    }]);