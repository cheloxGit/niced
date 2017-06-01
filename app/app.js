(function() {
'use strict';

var angular_app = angular.module('niceDApp', ['smart-table']);

    angular_app.controller('MainController', function ($scope, $http) {
      $scope.formData = {};

      $http.get('/api/getUser')
        .then(function (response){
          $scope.data_user = angular.fromJson(response['data']);
        });
      });

    angular_app.factory('DataService', function($http, $q){
      function DataService(){
        var self = this;
        self.user = null;
        self.repo = null;

        self.getUser = function (){
          var deferred = $q.defer();

          $http.get('/api/getUser/')
            .then (function (response){
              self.user = angular.fromJson(response['data']);
              deferred.resolve(angular.fromJson(response['data']));
            });

          return deferred.promise;
        }

        self.getRepo = function (login_user){
          var deferred = $q.defer();

          $http.get('/api/getRepo/'+login_user)
            .then(function (response){
              self.repo = angular.fromJson(response['data']);
              deferred.resolve(angular.fromJson(response['data']));
            });

            return deferred.promise;
        }

      }

      return new DataService();
    });

    angular_app.controller('CtrlUsers',['$scope','$http','DataService', function($scope, $http, DataService){
      $scope.formData = {};

      this.getUsers = function(){
        this.tab = 2;
        $scope.users = {};

        DataService.getUser()
          .then(
            function (data){
              $scope.rowCollection = angular.fromJson(data);
              $scope.showListUsers = true;
            },
            function (result){
              console.log('Failes, result is:'+ result);
            }
          );
      }

      this.getUsers();

      this.showTable = function (login_user){

        DataService.getRepo(login_user)
          .then(
            function (data){
              $scope.rowCollectionRepos = angular.fromJson(data);
              $scope.itemsByPage=10;

              $scope.showListUsers = false;
              $scope.showListRepos = true;
            },
            function (result){
              console.log('Failes, result is:'+ result);
            }
        );
      }
    }]);
})();
