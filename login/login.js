'use strict';

angular.module('myApp.login', ['ngRoute'])

.controller('LoginCtrl', function($scope, Authentication, FIREBASE_URL, $firebaseAuth, $modalInstance) {

  // $scope.errorMessage = false;
  // $scope.errorMessageReset = false;
  var ref = new Firebase(FIREBASE_URL);
  $scope.submittedPassword = false;
  $scope.authObj = $firebaseAuth(ref);

  $scope.submitLoginPassword = function () {
    $scope.submittedPassword = true;
    if (!$scope.loginUserForm.$valid) {
    } else if (!($scope.approvedTeachers.indexOf($scope.loginUser.email) > -1) &&
               !($scope.approvedStudents.indexOf($scope.loginUser.email) > -1)) {
      console.error("Error: unauthorized user");
      $scope.errorMessage = "You are not an authorized user";
      $scope.$emit('UNLOAD');
      $scope.loading = false;
    } else {
      $scope.$emit('LOAD');
      $scope.authObj.$authWithPassword({
        email    : $scope.loginUser.email,
        password : $scope.loginUser.password
      }).then(function(authData) {
        console.log("Authenticated successfully with payload:", authData);
        $scope.submittedPassword = false;
        $modalInstance.close(authData);
      }).catch(function(error) {
        console.error("Error: ", error);
        $scope.errorMessage = error.message;
        $scope.$emit('UNLOAD');
        $scope.loading = false;
      });
    };
  };

  $scope.newUser = function() {
    $modalInstance.close('signUpInstead');
  };

  // $scope.submitLoginPassword = function () {
  //   $scope.submittedPassword = true;
  //   if (!$scope.loginUserForm.$valid) {
  //   } else if (!($scope.approvedTeachers.indexOf($scope.loginUser.email) > -1) &&
  //              !($scope.approvedStudents.indexOf($scope.loginUser.email) > -1)) {
  //     console.error("Error: unauthorized user");
  //     $scope.errorMessage = "You are not an authorized user";
  //     $scope.$emit('UNLOAD');
  //     $scope.loading = false;
  //   } else {
  //     $scope.$emit('LOAD');
  //     var ref = new Firebase(FIREBASE_URL);
  //     ref.authWithPassword({
  //       email    : $scope.loginUser.email,
  //       password : $scope.loginUser.password
  //     }, function(error, authData) {
  //       if (error) {
  //         console.error("Error: ", error);
  //         $scope.errorMessage = error.message;
  //         $scope.$emit('UNLOAD');
  //         $scope.loading = false;
  //         debugger;
  //       } else {
  //         console.log("Authenticated successfully with payload:", authData);
  //         $scope.submittedPassword = false;
  //         $modalInstance.close(authData);
  //       };
  //     });
  //   };
  // };

  // $scope.googleLogin = function() {
  //   $scope.$emit('LOAD');
  //   var ref = new Firebase(FIREBASE_URL);
  //   ref.authWithOAuthPopup("google", function(error, authData) { 
  //       if (error) {
  //         console.log("Login Failed!", error);
  //         $scope.$emit('UNLOAD');
  //       } else {
  //         console.log("Authenticated successfully with payload:", authData);
  //         $modalInstance.close(authData)
  //       } 
  //     }, {
  //   })
  // };

}); // LoginCtrl
