'use strict';

angular.module('myApp.question', ['ngRoute'])

.config(function($routeProvider) {
  $routeProvider.when('/question/:questionID', {
    templateUrl: '/question/question.html',
    controller: 'QuestionCtrl',
    resolve: {
      'currentAuth': ['CurrentAuth', function(CurrentAuth) {
        return CurrentAuth.$requireAuth();
      }]
    }
  });
})

.controller('QuestionCtrl', function($scope, currentAuth, FIREBASE_URL, $routeParams, $firebaseArray, $firebaseObject, $timeout) {
  
  $scope.questionID = $routeParams.questionID
  $scope.userID = currentAuth.uid;
	var ref = new Firebase(FIREBASE_URL);
  var refQuestion = ref.child('questions').child($scope.questionID).child('content');
  $scope.replies = $firebaseArray(ref.child('questions').child($scope.questionID).child('replies'));
  $scope.currentLog = ref.child('currentlog');

  refQuestion.once('value', function(questionSnapshot) {
    $scope.question = questionSnapshot.val();
  });

  $scope.sortByVotes = function() {
    $scope.replies = $firebaseArray(ref.child('questions').child($scope.questionID).child('replies').orderByChild("votes").limitToLast(40));
  };

  $scope.sortByLatest = function() {
    $scope.replies = $firebaseArray(ref.child('questions').child($scope.questionID).child('replies').limitToLast(40));
  };

  $scope.addReply = function() {
    if ($scope.reply != null) {
      var currentDate = new Date();
      var hours = currentDate.getHours();
      var minutes = currentDate.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      var timestr = hours + ':' + minutes + ' ' + ampm;
      var newReply = {
        user: $scope.userID, date: timestr, votes: 0, content: $scope.reply, userVotes: {test: "test"}
      }; 
      $scope.replies.$add(newReply);
      $scope.reply = "";
      $scope.currentLog.push(newReply); 
    };
  };

  $scope.replyUpVote = function(replyIndex) {
    if (!$scope.replies[replyIndex].userVotes[$scope.userID] && !($scope.replies[replyIndex].user == $scope.userID)) {
      $scope.replies[replyIndex].votes++; 
      $scope.replies[replyIndex].userVotes[$scope.userID] = true;
      $scope.replies.$save(replyIndex);
      var currentDateBeforeString = new Date();
      var currentDate = currentDateBeforeString.toString();
      $scope.currentLog.push({date: currentDate, reply: $scope.replies[replyIndex].content, votes: $scope.replies[replyIndex].votes});
    };
  };

});