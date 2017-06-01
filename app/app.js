(function() {
'use strict';

var angular_app = angular.module('niceDApp', ['smart-table']);
  // angular.module('meetIrl', [
  //   'ui.router'
  // ])


  angular_app.controller('MainController', function ($scope, $http) {
    $scope.formData = {};
    $scope.imagePath = 'img/washedout.png';

    $http.get('/api/getUser')
      .success(function (data){
        $scope.data_user = JSON.parse(data);
        console.log(JSON.parse(data));
      })
      .error(function  (data){
        console.log('Error: ', data);
      })
    // $https.get('https://api.github.com/users/cheloxGit')
    //   .success(function(data){
    //     $scope.data_user = data;
    //     console.log(data);
    //   })
    //   .error(function(data){
    //     console.log('Error' + data);
    //   });

  // .config(function($urlRouterProvider) {
  //   $urlRouterProvider.otherwise("/");
  });
  angular_app.factory('DataService', function($http, $q){
    function DataService(){
      var self = this;
      self.user = null;
      self.repo = null;

      self.getUser = function (){
        var deferred = $q.defer();

        $http.get('/api/getUser/')
          .success(function (response){
            self.user = JSON.parse(response);
            deferred.resolve(response);
          });

        return deferred.promise;
      }

      self.getRepo = function (login_user){
        var deferred = $q.defer();
        console.log('getRepo');
        $http.get('/api/getRepo/'+login_user)
          .success(function (response){
            // console.log('self.repo:');
            console.log('response:');
            console.log(response);
            self.repo = JSON.parse(response);
            deferred.resolve(response);
          });

        return deferred.promise;
      }

    }
    return new DataService();
  });

  angular_app.controller('CtrlUsers',['$scope','$http','DataService', function($scope, $http, DataService){
    $scope.formData = {};
    // this.tab = 1;
    // this.showListUsers = false;
    // this.showListRepos = false;
    this.getUsers = function(){
      this.tab = 2;
      $scope.users = {};
      console.log('getUsers before:');
      DataService.getUser()
        .then(
            function (data){

              $scope.rowCollection = JSON.parse(data);
              $scope.showListUsers = true;
              // $scope.showListRepos = false;
              // console.log("rowCollection:");
              // console.log(JSON.parse(data));
            },
            function (result){
              console.log('Failes, result is:'+ result);
            }
        )
    }

    this.getUsers();

    this.showTable = function (login_user){
      // this.tab =3;
      console.log('showTable [login_user]:');
      console.log(login_user);

      DataService.getRepo(login_user)
        .then(
            function (data){

              $scope.rowCollectionRepos = JSON.parse(data);
              $scope.showListUsers = false;
              $scope.showListRepos = true;
              console.log("rowCollectionRepos:");
              console.log(JSON.parse(data));
            },
            function (result){
              console.log('Failes, result is:'+ result);
            }
        )
    }

    // this.setTab = function (newVal){
    //   this.tab = newVal;
    // };


  //   this.isSet = function(tabName){
  //    return this.tab === tabName;
  //  };

  }]);

})();
