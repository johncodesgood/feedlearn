'use strict';

angular.module('myApp.home', ['ngRoute','firebase', 'ui.bootstrap'])

.config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: '/home/home.html',
    controller: 'HomeCtrl',
  });
  $locationProvider.html5Mode(true);
})

.controller('HomeCtrl', function($scope, FIREBASE_URL, $modal, $location) {
	$scope.myInterval = 3000;

	var ref = new Firebase(FIREBASE_URL);

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
    });
  };

	$scope.submitContactUs = function() {
		if (!$scope.contactUs.$valid) {
        $scope.submitted = true;
    } else {
      $scope.submittedSuccess = true;
      var datetimeBeforeString = new Date();
      var datetime = datetimeBeforeString.toString();
    	var contactUsForm = {
    		name: $scope.contactUsInfo.name,
        email: $scope.contactUsInfo.email,
        subject: $scope.contactUsInfo.subject,
        message: $scope.contactUsInfo.message,
        datetime: datetime
      }

      var contactUsRef = ref.child('contactus');
      contactUsRef.push(contactUsForm);
      $scope.submitted = false;
      $scope.contactUsInfo.name = null;
      $scope.contactUsInfo.email = null;
      $scope.contactUsInfo.subject = null;
      $scope.contactUsInfo.message = null;

    } 
  }

});