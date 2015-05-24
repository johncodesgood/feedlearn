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

  $scope.userID = currentAuth.uid;
	var ref = new Firebase(FIREBASE_URL);
  $scope.questions = $firebaseArray(ref.child('questions').limitToLast(40));
  $scope.smileys = $firebaseObject(ref.child('smileys'));
  $scope.currentLog = ref.child('currentlog');


  $scope.selectSmileyCool = function() {
    if (!$scope.waitSmileyCool) {
      $scope.waitSmileyCool = true;
      $scope.smileys.sumCool++;
      $scope.smileys.$save();
      var currentDateBeforeString = new Date();
      var currentDate = currentDateBeforeString.toString();
      $scope.currentLog.push({date: currentDate, smiley: "cool", totalNum: $scope.smileys.sumCool});
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
      var currentDateBeforeString = new Date();
      var currentDate = currentDateBeforeString.toString();
      $scope.currentLog.push({date: currentDate, smiley: "sad", totalNum: $scope.smileys.sumSad});
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
      var currentDateBeforeString = new Date();
      var currentDate = currentDateBeforeString.toString();
      $scope.currentLog.push({date: currentDate, smiley: "lost", totalNum: $scope.smileys.sumLost});
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
      var currentDateBeforeString = new Date();
      var currentDate = currentDateBeforeString.toString();
      $scope.currentLog.push({date: currentDate, smiley: "asleep", totalNum: $scope.smileys.sumAsleep});
      $timeout(deselectSmileyAsleep, 60000);
    };
  };

  function deselectSmileyAsleep() {
      $scope.waitSmileyAsleep = false;
  };

  $scope.sortByVotes = function() {
    $scope.questions = $firebaseArray(ref.child('questions').orderByChild("votes").limitToLast(40));
    $scope.yourQuestions = false;
  };

  $scope.sortByLatest = function() {
    $scope.questions = $firebaseArray(ref.child('questions').limitToLast(40));
    $scope.yourQuestions = false;
  };

  $scope.userQuestions = function() {
    $scope.questions = $firebaseArray(ref.child('questions').orderByChild('user').equalTo($scope.userID));
    $scope.yourQuestions = true;
  };

  $scope.addQuestion = function() {
    if ($scope.question != "") {
      var currentDate = new Date();
      var hours = currentDate.getHours();
      var minutes = currentDate.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      var timestr = hours + ':' + minutes + ' ' + ampm;
      var newQuestion = {
        user: $scope.userID, date: timestr, votes: 0, content: $scope.question, userVotes: {test: "test"}
      }; 
      $scope.questions.$add(newQuestion);
      // $scope.questions.$add(newQuestion).then(function(ref) {
      //   var questionKey = ref.key();
      //   var keyAndQuestion = {};
      //   keyAndQuestion[questionKey] = newQuestion;
      //   var ref = new Firebase(FIREBASE_URL);
      //   var userRef = ref.child('users').child($scope.userID);
      //   userRef.update(keyAndQuestion);
      // });
      $scope.question = "";
      $scope.currentLog.push(newQuestion); 
    };
  };

  $scope.questionUpVote = function(questionIndex) {
    if (!($scope.questions[questionIndex].user == $scope.userID)) {
      if (!$scope.questions[questionIndex].userVotes[$scope.userID]) {
        $scope.questions[questionIndex].votes++; 
        $scope.questions[questionIndex].userVotes[$scope.userID] = true;
        $scope.questions.$save(questionIndex);
      } else {
        $scope.questions[questionIndex].votes--;
        $scope.questions.$save(questionIndex);
        var ref = new Firebase(FIREBASE_URL);
        var removeUpvoteRef = ref.child('questions').child($scope.questions[questionIndex].$id).child('userVotes').child($scope.userID);
        removeUpvoteRef.remove();
      };
      var currentDateBeforeString = new Date();
      var currentDate = currentDateBeforeString.toString();
      $scope.currentLog.push({date: currentDate, question: $scope.questions[questionIndex].content, votes: $scope.questions[questionIndex].votes});
    };
  };

  $scope.questionRemove = function(questionIndex) {
    var questionID = $scope.questions[questionIndex].$id;
    var ref = new Firebase(FIREBASE_URL);
    var removeQuestionRef = ref.child('questions').child(questionID);
    removeQuestionRef.remove();
    var currentDateBeforeString = new Date();
    var currentDate = currentDateBeforeString.toString();
    $scope.currentLog.push({date: currentDate, question: $scope.questions[questionIndex].content, removedBy: "student"});
  };

});