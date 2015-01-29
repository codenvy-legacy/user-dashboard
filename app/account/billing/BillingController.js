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
    .controller('BillingCtrl', function ($scope, Countries, PaymentService) {

        $scope.creditCards = [];
        $scope.countries = Countries.all();
        $scope.country = Countries.default();




        var init = function () {
            $scope.creditCards = [];

        };
        init();
    }
);