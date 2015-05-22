'use strict';

angular.module('myApp.login', ['ngRoute'])

.controller('LoginCtrl', function($scope, Authentication, FIREBASE_URL, $modalInstance) {

  $scope.googleLogin = function() {
    $scope.$emit('LOAD');
    var ref = new Firebase(FIREBASE_URL);
    ref.authWithOAuthPopup("google", function(error, authData) { 
        if (error) {
          console.log("Login Failed!", error);
          $scope.$emit('UNLOAD');
        } else {
          console.log("Authenticated successfully with payload:", authData);
          $modalInstance.close(authData)
        } 
      }, {
        // scope: "email"
    })
  };

}); // LoginCtrl
