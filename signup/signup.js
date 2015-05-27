'use strict';

angular.module('myApp.signup', ['ngRoute'])

.controller('SignupCtrl', function($scope, Authentication, FIREBASE_URL, $firebaseAuth, $modalInstance) {

  var ref = new Firebase(FIREBASE_URL);
  $scope.authObj = $firebaseAuth(ref);
  $scope.submitted = false;
  $scope.submittedPassword = false;
  $scope.signUpEmailModel = null;
  $scope.errorMessage = null;
  $scope.loading = false;

  $scope.submitSignUpPassword = function() {
    $scope.submittedPassword = true;    
    if (!$scope.signUpUserForm.$valid) {
    } else if (!($scope.approvedTeachers.indexOf($scope.signUpEmailModel) > -1) &&
               !($scope.approvedStudents.indexOf($scope.signUpEmailModel) > -1)) {
      console.error("Error: unauthorized user");
      $scope.errorMessage = "You are not an authorized user";
      $scope.$emit('UNLOAD');
      $scope.loading = false;
    } else {
      $scope.$emit('LOAD');
      $scope.loading = true;
      $scope.authObj.$createUser({
        email: $scope.signUpEmailModel,
        password: $scope.signUpPasswordModel
      }).then(function(userData) {
        console.log('userdata: ', userData.uid);
          return $scope.authObj.$authWithPassword({
            email: $scope.signUpEmailModel,
            password: $scope.signUpPasswordModel
          });
      }).then(function(authData) {
        console.log("Logged in as:", authData.uid);
        $scope.submittedPassword = false;
        $modalInstance.close(authData);
      }).catch(function(error) {
        console.error("Error: ", error);
        $scope.errorMessage = error.message;
        $scope.$emit('UNLOAD');
        $scope.loading = false;
      });
    }    
  };

}); // SignupCtrl
