/**
 * Created by Ann on 1/26/15.
 *
 * Service for manipulations with invoices.
 */
angular.module('odeskApp')
    .factory('InvoiceService', ['$http', '$q', function InvoiceService($http, $q) {
        InvoiceService.invoices = [];

        InvoiceService.getInvoices = function (accountId) {
            var deferred = $q.defer();
            var con = {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            };
            $http.get('/api/invoice/' + accountId, con)
                .success(function (data) {
                    InvoiceService.invoices = data;
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        return InvoiceService;
    }]);