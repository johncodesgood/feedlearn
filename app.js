'use strict';

angular.module('myApp', [
  'ngRoute',
  'myApp.home',
  'myApp.student',
  'myApp.teacher',
  'myApp.login',
  'myApp.signup',
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
  var studentUsersRef = ref.child('studentList');
  studentUsersRef.once('value', function(studentSnapshot) {
    $rootScope.approvedStudents = studentSnapshot.val();
    console.log('student list: ', $rootScope.approvedStudents)
  });
  var teacherUsersRef = ref.child('teacherList');
  teacherUsersRef.once('value', function(teacherSnapshot) {
    $rootScope.approvedTeachers = teacherSnapshot.val();
    console.log('teacher list: ', $rootScope.approvedTeachers)
  });
  var smileyTimeoutRef = ref.child('smileyTimeout');
  smileyTimeoutRef.once('value', function(smileyTimeoutSnapshot) {
    $rootScope.smileyTimeoutValue = smileyTimeoutSnapshot.val();
    console.log('smiley timeout: ', $rootScope.smileyTimeoutValue)
  });
  var authObj = $firebaseAuth(ref);
  authObj.$onAuth(function(authData) {
    console.log("Auth listener: Called");
    if (authData) {
      $rootScope.currentUser = authData;
      $rootScope.smileys = $firebaseObject(ref.child('smileys'));
      if ($rootScope.approvedTeachers.indexOf(authData.password.email) > -1) {
        $rootScope.teacherOrStudent = "teacher";
        $location.path('/teacher');
      } else if ($rootScope.approvedStudents.indexOf(authData.password.email) > -1) { 
        $rootScope.teacherOrStudent = "student";
        $location.path('/student');
      } else {
        $location.path('/');
      } 
    } else {
      $rootScope.currentUser = null;
      console.log("Auth listener: No data found");
      $location.path('/');
    }
  });
})
.config(function($routeProvider, $locationProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
  $locationProvider.html5Mode(true);
})
.constant('FIREBASE_URL', 'https://feedforwardnew.firebaseio.com/')
// .constant('FIREBASE_URL', 'https://feedforward.firebaseio.com/')
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
.directive("scrollBottom", function(){
    return {
        link: function(scope, element, attr){
            var $id= $("#" + attr.scrollBottom);
            $(element).on("click", function(){
                $id.scrollTop($id[0].scrollHeight);
            });
        }
    }
})
.controller("LoadingCtrl", function($scope) {
  $scope.$on('LOAD', function(){$scope.loading = true});
  $scope.$on('UNLOAD', function(){$scope.loading = false});
})
.controller("NavCtrl", function($scope, $location, $firebaseAuth, $firebaseObject, Authentication, $log, FIREBASE_URL, $modal) {
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
      if (authData == 'signUpInstead') {
        $scope.openSignup();
      }
    });
  };

  $scope.openSignup = function () {
    var modalInstance = $modal.open({
      templateUrl: '/signup/signup.html',
      controller: 'SignupCtrl',
      size: 'sm'
    });
    modalInstance.result.then(function (authData) {
      $scope.authData = authData;
      if (authData == 'loginInstead') {
        $scope.openLogin();
      }
    });
  };

  $scope.logout = function() 
  {
    var userID = $scope.currentUser.uid;
    var ref = new Firebase(FIREBASE_URL);
    var userSmileyRef = ref.child('userSmileys').child(userID);
    userSmileyRef.once('value', function(userSmileySnapshot) 
      {
        var val = userSmileySnapshot.val();
        switch (val) 
        {
          case "cool":
            $scope.smileys.sumCool--;
            userSmileyRef.remove();
            $scope.smileys.$save();
            break;
          case "sad":
            $scope.smileys.sumSad--;
            userSmileyRef.remove();
            $scope.smileys.$save();
            break;
          case "lost":
            $scope.smileys.sumLost--;
            userSmileyRef.remove();
            $scope.smileys.$save();
            break;
          case "asleep":
            $scope.smileys.sumAsleep--;
            userSmileyRef.remove();
            $scope.smileys.$save();
            break;
        };
      });
    Authentication.logout();
  };

});