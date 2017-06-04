(function(angular) {
'use strict';

var angular_app = angular.module('niceDApp', ['smart-table','ngRoute'])

// configure our routes
angular_app.config(function($routeProvider, $locationProvider) {
  $routeProvider
      // route for the home page
      .when('/', {
          templateUrl : '/components/home/listUsers.html',
          controller  : 'CtrlMain'
      })
      // route for the about page
      .when('/listRepos/:login_n', {
          templateUrl : '/components/home/listRepos.html',
          controller  : 'CtrlUsers'
      })
      .otherwise({
        redirectTo: '/'
      });
      // Add HTML5 History API support
      $locationProvider.html5Mode(true);
});

angular_app.controller('CtrlMain', function ($scope, $http) {
      $scope.formData = {};

      $http.get('/api/getUser')
        .then(function (response){
          $scope.data_user = angular.fromJson(response['data']);
        });
})

angular_app.factory('DataService', function($http, $q){
      function DataService(){
        var self = this;
        self.user = null;
        self.repo = null;

        self.getDetailUser = function (){
          var deferred = $q.defer();

          $http.get('/api/getDetailUser')
            .then(function (response){
              self.repo = angular.fromJson(response['data']);
              deferred.resolve(angular.fromJson(response['data']));
            });

          return deferred.promise;
        }

        self.getRepo = function (login_name){
          var deferred = $q.defer();

          $http.get('/api/getRepo/'+login_name)
            .then(function (response){
              self.repo = angular.fromJson(response['data']);
              deferred.resolve(angular.fromJson(response['data']));
            });

          return deferred.promise;
        }
      }

      return new DataService();
    });

angular_app.controller('CtrlUsers',['$scope','$http','$routeParams', 'DataService', function($scope, $http, $routeParams, DataService){
  $scope.formData = {};

  this.getUsers = function(){
    $scope.users = {};

    DataService.getDetailUser()
      .then(
        function (resp){
          $scope.showDetailUser = true;
          $scope.rowCollection = angular.fromJson(resp);
        },
        function (result){
          console.log('Failes, result is:'+ result);
        }
      );
      $scope.showListUsers = true;
  }

  this.getUsers();
}])
  .directive('myDirective', function(){
      return {
          restrict: 'E',
          template: "<div><button ng-click='updateparent({person: usrPerson})'>click</button></div>",
          replace: true,
          scope: { usrPerson: '=', updateparent: '&' }
      }
  });

angular_app.controller('CtrlRepos',['$scope','$http','$routeParams','DataService', function($scope, $http, $routeParams, DataService){
  $scope.formData = {};

  this.showTable = function (){
      DataService.getRepo($routeParams.login_n)
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
  this.showTable();
}]);

})(window.angular);
