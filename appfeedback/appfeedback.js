'use strict';

angular.module('myApp.appfeedback', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/appfeedback', {
    templateUrl: '/appfeedback/appfeedback.html',
    controller: 'AppFeedbackCtrl',
  });
  $locationProvider.html5Mode(true);
})

.controller('AppFeedbackCtrl', function($scope, FIREBASE_URL, $modal) {
	$scope.myInterval = 3000;

	var ref = new Firebase(FIREBASE_URL);
	$scope.submitted = false;
  $scope.submittedSuccess = false;

	$scope.submitContactUs = function() {
		if (!$scope.contactUs.$valid) {
        $scope.submitted = true;
    } else {
      $scope.submittedSuccess = true;
      var datetimeBeforeString = new Date();
      var datetime = datetimeBeforeString.toString();
    	var feedbackForm = {
    		name: $scope.contactUsInfo.name || "",
        email: $scope.contactUsInfo.email || "",
        message: $scope.contactUsInfo.message || "",
        datetime: datetime || ""
      }

      var contactUsRef = ref.child('appfeedback');
      contactUsRef.push(feedbackForm);
      $scope.submitted = false;
      $scope.contactUsInfo.name = null;
      $scope.contactUsInfo.email = null;
      $scope.contactUsInfo.subject = null;
      $scope.contactUsInfo.message = null;
    } 
  }

});