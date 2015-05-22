'use strict';

angular.module('myApp', [
  'ngRoute',
  'myApp.home',
  'myApp.student',
  'myApp.teacher',
  'myApp.login',
  'myApp.appfeedback',
  'firebase'
])
.run(function($rootScope, $location, $firebaseAuth, $firebaseObject, FIREBASE_URL) {
  $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    // We can catch the error thrown when the $requireAuth promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $location.path("/");
    }
  });
  var ref = new Firebase(FIREBASE_URL);
  var authObj = $firebaseAuth(ref);
  authObj.$onAuth(function(authData) {
    console.log("Auth listener: Called");
    if (authData) {
      $rootScope.currentUser = authData;
      if (authData.uid == "google:110137350934623881673") {
        $location.path('/teacher');
      } else {
        $location.path('/student');
      }; 
    } else {
      $rootScope.currentUser = null;
      console.log("Auth listener: No facebook data found");
      $location.path('/');
    }
  });
})
.config(function($routeProvider, $locationProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
  $locationProvider.html5Mode(true);
})
.constant('FIREBASE_URL', 'https://feedforward.firebaseio.com/')
.factory("CurrentAuth", function($firebaseAuth, FIREBASE_URL) {
  console.log("CurrentAuth factory called");
  var refAuth = new Firebase(FIREBASE_URL);
  return $firebaseAuth(refAuth);
})
.factory('Authentication', function($firebaseAuth, FIREBASE_URL) {
  var ref = new Firebase(FIREBASE_URL);
  var refAuth = $firebaseAuth(ref);

  var authObject = {
    login : function(user) {
      console.log("google login function called");
      return ref.authWithOAuthPopup("google", function(error, authData) { 
        if (error) {
          console.log("Login Failed!", error);
          $scope.$emit('UNLOAD');
        } else {
          console.log("Authenticated successfully with payload:", authData);
        } 
      }, {
        scope: "email"
      })
    },
    logout: function() {
      console.log("google logout function called");
      return refAuth.$unauth();  
    }
  };
  return authObject;
})
.directive('scroll', function($timeout) {
  return {
    restrict: 'A',
    link: function(scope, element, attr) {
      scope.$watchCollection(attr.scroll, function(newVal) {
        $timeout(function() {
         element[0].scrollTop = element[0].scrollHeight;
        });
      });
    }
  }
})
.controller("LoadingCtrl", function($scope) {
  $scope.$on('LOAD', function(){$scope.loading = true});
  $scope.$on('UNLOAD', function(){$scope.loading = false});
})
.controller("NavCtrl", function($scope, $location, $firebaseAuth, Authentication, $log, FIREBASE_URL, $modal) {
  $scope.isCollapsed = true;

  $scope.$on('$routeChangeSuccess', function () {
        $scope.isCollapsed = true;
    });

  $scope.openLogin = function () {
    var modalInstance = $modal.open({
      templateUrl: '/login/login.html',
      controller: 'LoginCtrl',
      size: 'sm'
    });
    modalInstance.result.then(function (authData) {
      $scope.authData = authData;
    });
  };

  $scope.logout = function() {
    Authentication.logout();
  };

});