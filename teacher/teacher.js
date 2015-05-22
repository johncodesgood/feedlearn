'use strict';

angular.module('myApp.teacher', ['ngRoute'])

.config(function($routeProvider) {
  $routeProvider.when('/teacher', {
    templateUrl: '/teacher/teacher.html',
    controller: 'TeacherCtrl',
    resolve: {
      'currentAuth': ['CurrentAuth', function(CurrentAuth) {
        return CurrentAuth.$requireAuth();
      }]
    }
  });
})

.controller('TeacherCtrl', function($scope, currentAuth, FIREBASE_URL, $firebaseArray, $firebaseObject, $timeout) {
  
  $scope.userID = currentAuth.uid;
	var ref = new Firebase(FIREBASE_URL);
  $scope.questions = $firebaseArray(ref.child('questions').limitToLast(40));
  $scope.smileys = $firebaseObject(ref.child('smileys'));

  $scope.resetSmileys = function() {
    $scope.smileys.sumCool = 0;
    $scope.smileys.sumSad = 0;
    $scope.smileys.sumLost = 0;
    $scope.smileys.sumAsleep = 0;
    $scope.smileys.$save();
  };

  $scope.clearAllData = function() {
    $scope.smileys.sumCool = 0;
    $scope.smileys.sumSad = 0;
    $scope.smileys.sumLost = 0;
    $scope.smileys.sumAsleep = 0;
    $scope.smileys.$save();
    var refQuestions = new Firebase(FIREBASE_URL + 'questions');
    refQuestions.remove();
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
    $scope.questions[questionIndex].votes++; 
    $scope.questions[questionIndex].userVotes[$scope.userID] = true;
    $scope.questions.$save(questionIndex);
  };
});