'use strict';

angular.module('myApp.student', ['ngRoute'])

.config(function($routeProvider) {
  $routeProvider.when('/student', {
    templateUrl: '/student/student.html',
    controller: 'StudentCtrl',
    resolve: {
      'currentAuth': ['CurrentAuth', function(CurrentAuth) {
        return CurrentAuth.$requireAuth();
      }]
    }
  });
})

.controller('StudentCtrl', function($scope, currentAuth, FIREBASE_URL, $firebaseArray, $firebaseObject, $timeout) {
  console.log('on the student page')
  $scope.userID = currentAuth.uid;
	var ref = new Firebase(FIREBASE_URL);
  $scope.questions = $firebaseArray(ref.child('questions').limitToLast(40));
  $scope.smileys = $firebaseObject(ref.child('smileys'));

  $scope.selectSmileyCool = function() {
    if (!$scope.waitSmileyCool) {
      $scope.waitSmileyCool = true;
      $scope.smileys.sumCool++;
      $scope.smileys.$save();
      $timeout(deselectSmileyCool, 60000);
    };
  };

  function deselectSmileyCool() {
      $scope.waitSmileyCool = false;
  };

  $scope.selectSmileySad = function() {
    if (!$scope.waitSmileySad) {
      $scope.waitSmileySad = true;
      $scope.smileys.sumSad++;
      $scope.smileys.$save();
      $timeout(deselectSmileySad, 60000);
    };
  };

  function deselectSmileySad() {
      $scope.waitSmileySad = false;
  };

  $scope.selectSmileyLost = function() {
    if (!$scope.waitSmileyLost) {
      $scope.waitSmileyLost = true;
      $scope.smileys.sumLost++;
      $scope.smileys.$save();
      $timeout(deselectSmileyLost, 60000);
    };
  };

  function deselectSmileyLost() {
      $scope.waitSmileyLost = false;
  };

  $scope.selectSmileyAsleep = function() {
    if (!$scope.waitSmileyAsleep) {
      $scope.waitSmileyAsleep = true;
      $scope.smileys.sumAsleep++;
      $scope.smileys.$save();
      $timeout(deselectSmileyAsleep, 60000);
    };
  };

  function deselectSmileyAsleep() {
      $scope.waitSmileyAsleep = false;
  };

  $scope.sortByVotes = function() {
    $scope.questions = $firebaseArray(ref.child('questions').orderByChild("votes").limitToLast(40));
  };

  $scope.sortByLatest = function() {
    $scope.questions = $firebaseArray(ref.child('questions').limitToLast(40));
  };

  $scope.addQuestion = function() {
    if ($scope.question != null) {
      var currentDate = new Date();
      var hours = currentDate.getHours();
      var minutes = currentDate.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      var timestr = hours + ':' + minutes + ' ' + ampm; 
      $scope.questions.$add({
        user: $scope.userID, date: timestr, votes: 0, content: $scope.question, userVotes: {test: "test"}
      });
      $scope.question = "";
    };
  };

  $scope.questionUpVote = function(questionIndex) {
    if (!$scope.questions[questionIndex].userVotes[$scope.userID] && !($scope.questions[questionIndex].user == $scope.userID)) {
      $scope.questions[questionIndex].votes++; 
      $scope.questions[questionIndex].userVotes[$scope.userID] = true;
      $scope.questions.$save(questionIndex);
    };
  };
});