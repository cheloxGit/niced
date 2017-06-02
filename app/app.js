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

        self.getUser = function (){
          var deferred = $q.defer();

          $http.get('/api/getUser/')
            .then (function (response){
              self.user = response['data'];
              deferred.resolve(angular.fromJson(response['data']));
            });
          return deferred.promise;
        }

        self.getDetailUser = function (resp){
          var deferred = $q.defer();
          // .then (function (response){
          //   $http.get('/api/getDetailUser/'+encodeURIComponent(self.user))
          //     .then (function (resp){
          //       self.detail_user = angular.fromJson(resp['data']);
          //       deferred.resolve(angular.fromJson(resp['data']));
          //     })
          // });
          // console.log('resp: ');
          // console.log(resp);
          resp = JSON.stringify(resp);

          $http.get('/api/getDetailUser/'+encodeURIComponent(resp))
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

      // $scope.login_n = $routeParams.login_n;
      // $scope.getDetailUser = function (login_name){
      //   console.log('login name getDetailUser: ');
      //   console.log(login_name);
      //
      // }

      this.getUsers = function(){
        // this.tab = 2;
        $scope.users = {};

        DataService.getUser()
          .then(
            function (data){
              // var data_det = angular.fromJson(data);
              // var full_name = this.getDetailUser(data_det['']);
              // resp = data;
              // $scope.rowCollection = angular.fromJson(data);

              DataService.getDetailUser(data)
                .then(
                  function (resp){
                    // $scope.rowCollectionRepos = angular.fromJson(data);
                    // console.log(angular.fromJson(data));
                    // var data_det_usr = angular.fromJson(data);
                    $scope.showDetailUser = true;
                    console.log('angular.fromJson(resp)************: ');
                    console.log(angular.fromJson(resp));
                    $scope.rowCollection = angular.fromJson(resp);
                    // return $scope.name_retrieve = data_det_usr['name'];
                    // return angular.fromJson(data['name']);
                    // $scope.showListUsers = false;
                    // $scope.showListRepos = true;
                  },
                  function (result){
                    console.log('Failes, result is:'+ result);
                  }
              );
              $scope.showListUsers = true;
            },
            function (result){
              console.log('Failes, result is:'+ result);
            }
          );
      }
      this.getUsers();
      // this.getDetailUser();
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
      // $scope.login_n = $routeParams.login_n;

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
      // this.getDetailUser();
    }]);

    angular_app.controller('CtrlDetailUser',['$scope','$http','DataService', function($scope, $http, $routeParams, DataService){
      $scope.formData = {};
      // $scope.login_n = $routeParams.login_n;

      this.getDetailUser = function (login_name){
        console.log('login name getDetailUser: ');
        console.log(login_name);
        DataService.getDetailUser(login_name)
          .then(
            function (data){
              // $scope.rowCollectionRepos = angular.fromJson(data);
              // console.log(angular.fromJson(data));
              var data_det_usr = angular.fromJson(data);
              $scope.showDetailUser = true;
              $scope.name_retrieve = data_det_usr['name'];
              // return angular.fromJson(data['name']);
              // $scope.showListUsers = false;
              // $scope.showListRepos = true;
            },
            function (result){
              console.log('Failes, result is:'+ result);
            }
        );
      }

      this.getDetailUser();
      // this.getDetailUser();
    }]);


})(window.angular);
