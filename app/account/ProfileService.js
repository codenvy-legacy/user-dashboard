/**
 * Created by Ann on 1/26/15.
 */
angular.module('odeskApp')
    .factory('ProfileService', ['$http', '$q', function ProfileService($http, $q) {
        ProfileService.profile = {};
        ProfileService.preferences = {};

        ProfileService.getProfile = function () {
            var deferred = $q.defer();
            var con = {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            };
            $http.get('/api/profile', con)
                .success(function (data) {
                    ProfileService.profile = data;
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        ProfileService.getProfileByUserId = function (userId) {
            var deferred = $q.defer();
            var con = {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            };
            $http.get('/api/profile/' + userId, con)
                .success(function (data) {
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        ProfileService.updateProfile = function (updateAttributes) {
            var deferred = $q.defer();
            var con = {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            };

            $http.post('/api/profile', updateAttributes, con)
                .success(function (data) {
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) {
                    deferred.reject();
                });
            return deferred.promise;
        }


        ProfileService.getPreferences = function () {
            var deferred = $q.defer();
            $http.get('/api/profile/prefs')
                .success(function (data) {
                    ProfileService.preferences = data;
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        ProfileService.updatePreferences = function (preferences) {
            var deferred = $q.defer();
            var con = {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            };

            $http.post('/api/profile/prefs', preferences, con)
                .success(function (data) {
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) {
                    deferred.reject();
                });
            return deferred.promise;
        }

        ProfileService.removePreference = function (preferences) {
            var deferred = $q.defer();
            var config = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                url: '/api/profile/prefs',
                data: preferences
            };
            $http(config).success(function (data) {
                deferred.resolve(data);
            }).error(function (err) {
                deferred.reject();
            });
            return deferred.promise;
        }

        return ProfileService;
    }]);